# CLAUDE.md

Guía para trabajar en este repositorio.

## Qué es esto

Dashboard web para una aplicación de **gestión de gastos personales**. Es solo el frontend: consume el backend `personal-finance-backend`, que expone **una única API GraphQL**.

Funcionalidad que debe cubrir el dashboard:

- Registro y consulta de **gastos** e **ingresos**, con filtros por rango de fechas y categoría.
- **Categorías** propias y del sistema, con jerarquía padre/hijo.
- **Inflación personal**: serie mensual del gasto con variaciones mensual y anual.
- **Catálogo de productos** con inventario (`inStock`), historial de compras, ciclos de consumo y predicción de agotamiento.

## Stack

- **React.js** con **TypeScript** (`strict: true`; evitar `any`, preferir tipos generados del esquema GraphQL).
- **Tailwind CSS** para todos los estilos. No escribir CSS suelto ni CSS-in-JS salvo que no haya alternativa; nada de estilos inline para cosas que Tailwind ya resuelve.
- Cliente GraphQL contra `POST http://localhost:3000/graphql` (configurable por variable de entorno, nunca hardcodeado en componentes).

## Convenciones

- Componentes en PascalCase, un componente por archivo.
- Las queries y mutations viven junto al feature que las usa, no en un barril global.
- Los tipos del dominio (`Expense`, `Income`, `Category`, `Product`, ...) se derivan del esquema GraphQL; no duplicar interfaces a mano si se pueden generar.
- El texto de la interfaz va en **español** (es la lengua del producto y de los mensajes de error del backend).

## Contrato con la API

### Autenticación

- `register` / `login` devuelven `accessToken` + `refreshToken` + `user`.
- Los endpoints marcados 🔒 requieren la cabecera `Authorization: Bearer <accessToken>`.
- **El refresh token rota**: `refreshTokens(refreshToken)` revoca el enviado y devuelve uno nuevo. Reutilizar el viejo da `UNAUTHORIZED`. El cliente debe guardar siempre el último y **serializar los refresh concurrentes** (una sola petición de refresh en vuelo, las demás esperan su resultado) o se invalidará la sesión.
- `logout(refreshToken)` revoca el token.
- `me` devuelve el usuario autenticado, incluida `baseCurrency` y `timezone`.

### El detalle importante de `userId`

Categorías, gastos e ingresos **no** están migrados al token todavía: reciben `userId` como argumento explícito y no validan que coincida con el del token. El frontend debe tomar ese `userId` de `me` y pasarlo en cada operación. Productos, compras, ciclos e inflación **sí** usan el token y no llevan `userId`.

### Formatos

- Fechas de movimientos (`occurredOn`, `purchasedOn`, `depletedOn`): string `YYYY-MM-DD`.
- Periodos de inflación (`from`, `to`): string `YYYY-MM`.
- `createdAt` / `updatedAt`: `DateTime` ISO 8601.
- Importes: `Float` en la moneda de `currency`; `exchangeRate` los convierte a la moneda base del usuario. Para totales y comparativas usar `amount * exchangeRate`.

### Operaciones principales

| Área | Queries | Mutations |
| --- | --- | --- |
| Auth | — | `register`, `login`, `refreshTokens`, `logout` |
| Perfil | 🔒 `me` | — |
| Categorías | `categories(userId, kind)`, `category(id)` | `createCategory`, `updateCategory`, `removeCategory` |
| Gastos | `expenses(userId, filter)`, `expense(id)` | `createExpense`, `updateExpense`, `removeExpense` |
| Ingresos | `incomes(userId, filter)`, `income(id)` | `createIncome`, `updateIncome`, `removeIncome` |
| Inflación | 🔒 `expenseInflation(filter)` | — |
| Productos | 🔒 `products(search, includeInactive)`, `product(id)`, `productStats` | 🔒 `createProduct`, `updateProduct`, `removeProduct` |
| Compras | 🔒 `productPurchases(productId)`, `consumptionCycles(productId)` | 🔒 `registerProductPurchase`, `markProductDepleted` |
| Utilidad | `health` | — |

`TransactionsFilterInput`: `from`, `to`, `categoryId`, `paymentMethodId`. Resultados ordenados por fecha descendente.
`InflationFilterInput`: `from`, `to` (`YYYY-MM`), `categoryId` (incluye subcategorías).

### Reglas de negocio que la UI debe respetar

- **Categorías del sistema** (`userId: null`) las ve todo el mundo y **no** se pueden editar ni borrar → ocultar o deshabilitar esas acciones; el backend responde `BAD_REQUEST`. Un usuario sí puede crear subcategorías colgando de una del sistema, siempre del mismo `kind`.
- **Gastos/ingresos**: `userId`, `description`, `amount` y `occurredOn` son obligatorios; `amount > 0`. Validar en el formulario antes de enviar.
- **Inflación**: los meses sin gastos **no aparecen** en la serie, y `monthlyRate` / `annualRate` son `null` cuando no hay periodo de comparación. Los gráficos deben tolerar huecos y nulos, no dibujar un 0 inventado. Mide la variación del gasto total, que se mueve por precios **y** por cantidad consumida — etiquetarlo así en la UI para no confundirlo con el IPC.
- **Ciclo de inventario**: `registerProductPurchase` → abre ciclo → `inStock: true`; `markProductDepleted` → cierra el ciclo, calcula `daysLasted` y **añade el producto a la lista de compras** (`autoAdded`) → `inStock: false`. Solo puede haber un ciclo abierto por producto; `depletedOn: null` es el ciclo en curso.
- `registerProductPurchase` acepta `productId` **o** `newProduct`, nunca ambos ni ninguno (`BAD_REQUEST`). En la UI: un selector de catálogo con opción "crear producto nuevo", excluyentes entre sí.
- `markProductDepleted` sobre un producto sin ciclo abierto falla → deshabilitar el botón cuando `inStock` sea falso.
- `productStats.estimatedDepletionDate` es una **estimación** (promedio de duración sobre el ciclo abierto); presentarla como tal.

### Errores

El código viene en `extensions.code`. Mapeo esperado en la UI:

| Código | Tratamiento |
| --- | --- |
| `UNAUTHENTICATED` | Intentar refresh una vez; si falla, cerrar sesión y llevar al login |
| `BAD_REQUEST` | Mostrar el `message` del backend junto al formulario (ya viene en español) |
| `NOT_FOUND` | Recurso inexistente o de otro usuario → estado vacío, no error rojo |
| `CONFLICT` | Solo en `register`: email ya registrado |
| `GRAPHQL_VALIDATION_FAILED` | Bug del cliente: query desalineada con el esquema. No mostrar al usuario |
| `INTERNAL_SERVER_ERROR` | Mensaje genérico + opción de reintentar |

## Enums

- `TransactionKind`: `EXPENSE`, `INCOME`
- `Recurrence`: `ONCE`, `DAILY`, `WEEKLY`, `BIWEEKLY`, `MONTHLY`, `BIMONTHLY`, `QUARTERLY`, `SEMIANNUAL`, `ANNUAL`
- `UnitOfMeasure`: `UNIT`, `GRAM`, `KILOGRAM`, `MILLILITER`, `LITER`, `PACK`, `ROLL`, `PAIR`, `OTHER`
- `AuthProvider`: `LOCAL`, `GOOGLE`

Los enums se muestran traducidos al usuario, pero se envían al backend con su valor literal.

## Convención de commits

- Los commits siguen la convención de *Conventional Commits*: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`, etc.
- Los commits se hacen **a nombre del dueño del repositorio** (`LuiferEduardoo <luifer01ortegaperez@gmail.com>`), sin trailers de co-autoría.

## Desarrollo

En desarrollo, el playground de Apollo está en la misma URL del endpoint (`http://localhost:3000/graphql`) abierta en el navegador: úsalo para verificar una query antes de escribir el hook.
