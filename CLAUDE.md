# CLAUDE.md

Guía para trabajar en este repositorio.

## Qué es esto

Dashboard web para una aplicación de **gestión de gastos personales**. Es solo el frontend: consume el backend `personal-finance-backend`, que expone **una única API GraphQL**.

Funcionalidad que debe cubrir el dashboard:

- Registro y consulta de **gastos** e **ingresos**, con filtros por rango de fechas, categoría y **cuenta**.
- Un gasto puede llevar una **lista de ítems** (artículo + precio + cantidad); su importe se calcula de los ítems.
- **Cuentas** (banco, efectivo, tarjeta, billetera) con datos de crédito para tarjetas.
- **Gastos recurrentes**: plantillas que generan gastos (con generación manual "vencidos").
- **Categorías** propias y del sistema, con jerarquía padre/hijo.
- **Inflación**: dos métricas separadas en pestañas — precios (`articleInflation`) y variación de gasto (`expenseInflation`).
- **Inventario** de artículos tipo `PRODUCT` (`inStock`), historial de compras, ciclos de consumo y predicción.

## Modelo de datos: cuentas, gastos multi-ítem, artículos e inventario

- **`accountId` en todos los movimientos** (gastos, ingresos, recurrentes y filtros); las respuestas traen `account { ... }`. El antiguo `paymentMethodId` ya no existe. Selector reutilizable [AccountSelect.tsx](src/features/accounts/AccountSelect.tsx).
- **Saldos y cupo** (verificado): `Account.balance` lo mantiene el backend (ingresos suben, gastos bajan, transferencias mueven); `availableCredit = creditLimit + balance` (null salvo crédito). En crédito, `balance` negativo es **deuda** y el cupo usado es `-balance`. Helpers `creditDebt`/`spendableAmount` en [account.ts](src/features/accounts/account.ts). Un gasto que excede el cupo → `BAD_REQUEST` "El gasto excede el cupo disponible de la tarjeta"; el form lo bloquea antes ([TransactionForm.tsx](src/features/transactions/TransactionForm.tsx)).
- **Transferencias** (`transferBetweenAccounts`, `accountTransfers`): validan misma-cuenta / fondos / cupo (`BAD_REQUEST`, verificados). Pagar tarjeta = transferir de activo → crédito (baja la deuda). La respuesta trae ambas cuentas con su `balance` nuevo → Apollo las normaliza por id. `recalculateAccountBalance(id)` corrige descuadres. UI en [AccountsPage.tsx](src/features/accounts/AccountsPage.tsx), [TransferModal.tsx](src/features/accounts/TransferModal.tsx), [AccountDetailPage.tsx](src/features/accounts/AccountDetailPage.tsx).
- **Cualquier movimiento cambia `balance`**: `createExpense`/`createIncome`/borrado/`runDueRecurringExpenses` refrescan `Accounts` además de las listas. El saldo **ignora `exchangeRate`** — usar una sola moneda por cuenta.
- **Un gasto es multi-ítem**: `Expense` ya **no** tiene `article`/`quantity`/`unitPrice`; viven en `items[]` (`ExpenseItem`: `unitPrice`, `quantity`, `subtotal`, `article`). Con ítems, `amount` **no se envía** (lo calcula el backend como suma de subtotales); sin ítems, `amount` es obligatorio. El backend valida "importe **o** al menos un ítem" (`BAD_REQUEST`, verificado). Modelo de filas y helpers en [items.ts](src/features/transactions/items.ts); UI en [ExpenseItemsEditor.tsx](src/features/transactions/ExpenseItemsEditor.tsx).
- Cada ítem lleva `articleId` **o** `newArticle`, nunca ambos (`BAD_REQUEST` "Envía solo uno...", verificado). XOR garantizado en cliente con `ArticleSelection` + `buildArticleInput` ([article.ts](src/features/articles/article.ts)). El selector combobox "elegir o crear" es [ArticleField.tsx](src/features/articles/ArticleField.tsx).
- **Pantalla de Artículos** ([ArticlesPage.tsx](src/features/articles/ArticlesPage.tsx), tab `/articulos`): CRUD (`createArticle`/`updateArticle`/`removeArticle`, verificado) con pestañas por tipo (Productos/Servicios/Otros). Cambiar el `type` de un artículo lo reclasifica. Bajo la pestaña **Productos** se muestra el inventario (stock, "se acabó", registrar compra, "Por reponer", historial); los otros tipos son solo catálogo. Reemplaza la antigua pantalla `Productos` (ruta `/productos` redirige a `/articulos`).
- **`Product` como tipo GraphQL no existe**: `products`/`product`/`updateProduct` devuelven `Article`; los args de inventario son `articleId` (no `productId`), y `productStats` es `ProductStatsView` keyed por `articleId`.
- **`CreateArticleInput` NO acepta `packageSize`/`barcode`/`isConsumable`** (sí `UpdateProductInput`, al editar producto). Los nombres de artículo son **únicos por usuario**: `newArticle` con un nombre existente falla con `INTERNAL_SERVER_ERROR` (constraint de Postgres), no `BAD_REQUEST` — por eso el combobox prioriza elegir el existente.
- **Efecto inventario** (verificado): un gasto con un ítem de tipo `PRODUCT` crea/reabre el producto y lo deja `inStock: true` **sin pasar por las mutaciones de producto**. `createExpense`/`updateExpense` evictan `products`/`productStats`/`productPurchases`/`consumptionCycles` cuando algún ítem es producto (`evictInventory` en [TransactionForm.tsx](src/features/transactions/TransactionForm.tsx)).
- **Recurrentes**: `recurrence` obligatorio y **no puede ser `ONCE`** (`BAD_REQUEST`, verificado); `startOn` obligatorio, `endOn` opcional, `nextRunOn` lo maneja el backend. `runDueRecurringExpenses` genera los vencidos. Sus ítems son `RecurringExpenseItem` (**sin `subtotal`**).
- **Las dos inflaciones no son comparables**: precios ~IPC (~10 %), gasto porcentajes grandes. Pestañas separadas ([InflationPage.tsx](src/features/inflation/InflationPage.tsx)). `expenseInflation` recibe solo `filter` (no `userId`).

## Stack

- **React 19** + **TypeScript** `strict` (con `noUncheckedIndexedAccess`), build con **Vite**.
- **Tailwind CSS v4** para todos los estilos, configurado por CSS (`@theme`), sin `tailwind.config.js`. No escribir CSS suelto ni CSS-in-JS salvo que no haya alternativa.
- **Apollo Client** contra el endpoint de `VITE_GRAPHQL_ENDPOINT` (nunca hardcodeado; se lee solo en `src/graphql/env.ts`).
- **Recharts** para gráficos, **react-router v7**, **react-hook-form + zod** para formularios.
- **oxlint** (no ESLint: es lo que trae la plantilla de Vite) + **Prettier**.

Comandos: `npm run dev` · `build` · `typecheck` · `lint` · `format` · `codegen`.

## Convenciones

- Componentes en PascalCase, un componente por archivo.
- Importar con el alias `@/…` (→ `src/…`), no con rutas relativas largas.
- Las queries y mutations viven junto al feature que las usa, no en un barril global.
- Los tipos del dominio (`Expense`, `Income`, `Category`, `Product`, ...) se generan con `npm run codegen` desde el esquema en vivo; **nunca** escribirlos a mano. Requiere el backend levantado.
- El texto de la interfaz va en **español** (es la lengua del producto y de los mensajes de error del backend).
- Mobile-first: se escribe el layout de móvil y se amplía con `sm:` / `lg:`, nunca al revés.

## Color

Los tokens están en `src/styles/theme.css` y **los valores están validados**; el razonamiento está en [docs/color.md](docs/color.md). Léelo antes de tocarlos — varias alternativas obvias fallan las comprobaciones de accesibilidad.

- Usar siempre roles (`text-income`, `bg-expense/10`), nunca hex ni `text-green-500`.
- `income` / `expense` / `warning` / `neutral` son **datos**. El chrome (fondos, bordes, texto) usa la escala neutra `surface*` / `border` / `ink*`.
- **Todo importe se renderiza con `<Money>`** (`src/components/Money.tsx`), que añade signo e icono direccional. El color nunca es el único portador del significado: verde y coral quedan a ΔE 6.2 bajo daltonismo en modo oscuro.
- Desglose por categoría: barras horizontales de un solo tono, no donut multicolor.

## Contrato con la API

### Autenticación

- `register` / `login` devuelven `accessToken` (JWT, 20 min) + `refreshToken` (opaco, 6 meses) + `user`.
- Los endpoints marcados 🔒 requieren la cabecera `Authorization: Bearer <accessToken>`.
- **El refresh token rota**: `refreshTokens(refreshToken)` revoca el enviado y devuelve uno nuevo. Reutilizar el viejo falla (verificado contra el backend). El cliente guarda siempre el último y **serializa los refresh concurrentes** — implementado en `src/features/auth/refresh.ts`, con tests en `refresh.test.ts`.
- `logout(refreshToken)` revoca el token.
- `me` devuelve el usuario autenticado, incluida `baseCurrency` y `timezone`.

> **Corrección a la documentación de la API**: dice que el login fallido y el refresh reutilizado devuelven `UNAUTHORIZED`. El backend real devuelve **`UNAUTHENTICATED`** en ambos casos (comprobado con curl). Esto importa: el `errorLink` no puede tratar todo `UNAUTHENTICATED` como "token caducado", o intentaría renovar tras un login fallido y taparía el mensaje "Credenciales inválidas". Las operaciones `Login`, `Register` y `RefreshTokens` están excluidas del refresco en `src/graphql/client.ts`.

### El detalle importante de `userId`

Categorías, gastos e ingresos **no** están migrados al token todavía: reciben `userId` como argumento explícito y no validan que coincida con el del token. El frontend debe tomar ese `userId` de `me` y pasarlo en cada operación. Productos, compras, ciclos e inflación **sí** usan el token y no llevan `userId`.

### Formatos

- Fechas de movimientos (`occurredOn`, `purchasedOn`, `depletedOn`): string `YYYY-MM-DD`.
- Periodos de inflación (`from`, `to`): string `YYYY-MM`.
- `createdAt` / `updatedAt`: `DateTime` ISO 8601.
- Importes: `Float` en la moneda de `currency`; `exchangeRate` los convierte a la moneda base del usuario. Para totales y comparativas usar `amount * exchangeRate`.

### Operaciones principales

| Área       | Queries                                                               | Mutations                                            |
| ---------- | --------------------------------------------------------------------- | ---------------------------------------------------- |
| Auth       | —                                                                     | `register`, `login`, `refreshTokens`, `logout`       |
| Perfil     | 🔒 `me`                                                               | —                                                    |
| Categorías | `categories(userId, kind)`, `category(id)`                            | `createCategory`, `updateCategory`, `removeCategory` |
| Gastos     | `expenses(userId, filter)`, `expense(id)`                             | `createExpense`, `updateExpense`, `removeExpense`    |
| Ingresos   | `incomes(userId, filter)`, `income(id)`                               | `createIncome`, `updateIncome`, `removeIncome`       |
| Inflación  | 🔒 `expenseInflation(filter)`                                         | —                                                    |
| Productos  | 🔒 `products(search, includeInactive)`, `product(id)`, `productStats` | 🔒 `createProduct`, `updateProduct`, `removeProduct` |
| Compras    | 🔒 `productPurchases(productId)`, `consumptionCycles(productId)`      | 🔒 `registerProductPurchase`, `markProductDepleted`  |
| Utilidad   | `health`                                                              | —                                                    |

`TransactionsFilterInput`: `from`, `to`, `categoryId`, `paymentMethodId`. Resultados ordenados por fecha descendente.
`InflationFilterInput`: `from`, `to` (`YYYY-MM`), `categoryId` (incluye subcategorías).

### Reglas de negocio que la UI debe respetar

- **Categorías del sistema** (`userId: null`) las ve todo el mundo y **no** se pueden editar ni borrar → ocultar o deshabilitar esas acciones; el backend responde `BAD_REQUEST`. Un usuario sí puede crear subcategorías colgando de una del sistema, siempre del mismo `kind`.
- **Gastos/ingresos**: `userId`, `description`, `amount` y `occurredOn` son obligatorios; `amount > 0`. **La validación en el formulario no es opcional**: el backend no valida el importe en su capa de aplicación, así que un `amount` negativo llega hasta la restricción de Postgres y vuelve como `INTERNAL_SERVER_ERROR` con el texto crudo `violates check constraint "expenses_amount_check"` (verificado). Ese mensaje no puede llegar al usuario; el esquema zod del formulario es la única barrera útil.
- **Valores por defecto del backend**: `currency` es `"COP"` y `exchangeRate` es `1` si no se envían.
- **Inflación**: los meses sin gastos **no aparecen** en la serie, y `monthlyRate` / `annualRate` son `null` cuando no hay periodo de comparación. Los gráficos deben tolerar huecos y nulos, no dibujar un 0 inventado. Mide la variación del gasto total, que se mueve por precios **y** por cantidad consumida — etiquetarlo así en la UI para no confundirlo con el IPC.
- **Ciclo de inventario**: `registerProductPurchase` → abre ciclo → `inStock: true`; `markProductDepleted` → cierra el ciclo, calcula `daysLasted` y **añade el producto a la lista de compras** (`autoAdded`) → `inStock: false`. Solo puede haber un ciclo abierto por producto; `depletedOn: null` es el ciclo en curso.
- `registerProductPurchase` acepta `productId` **o** `newProduct`, nunca ambos ni ninguno (`BAD_REQUEST`). En la UI: un selector de catálogo con opción "crear producto nuevo", excluyentes entre sí.
- `markProductDepleted` sobre un producto sin ciclo abierto falla con `BAD_REQUEST` ("El producto no tiene un ciclo de consumo abierto", verificado) → deshabilitar el botón cuando `inStock` sea falso.
- **`purchasedOn` es obligatorio** en `registerProductPurchase`, pese a que la documentación de la API lo omite en el ejemplo de `newProduct`. Sin él, la petición falla con `GRAPHQL_VALIDATION_FAILED` antes incluso de validar el XOR.
- **`totalPrice` es nullable**: se puede registrar una compra sin `unitPrice`. Mostrar "—", nunca 0.

> **La lista de compras no está expuesta.** El backend la mantiene (`markProductDepleted` añade el ítem como `autoAdded` y crea la lista si no existe), pero **no hay ninguna query en el esquema para leerla** — comprobado por introspección: las únicas queries son `categories`, `category`, `consumptionCycles`, `expense`, `expenseInflation`, `expenses`, `health`, `income`, `incomes`, `me`, `product`, `productPurchases`, `productStats`, `products`.
>
> Mientras siga así, la sección "Por reponer" se deriva en cliente de `isConsumable && !inStock`, que da la misma información desde el punto de vista del usuario. Si el backend expone la lista real (con `autoAdded` y el vínculo a la compra), hay que sustituir esa derivación por la query.

- `productStats.estimatedDepletionDate` es una **estimación** (promedio de duración sobre el ciclo abierto); presentarla como tal.

### Errores

El código viene en `extensions.code`. Mapeo esperado en la UI:

| Código                      | Tratamiento                                                                |
| --------------------------- | -------------------------------------------------------------------------- |
| `UNAUTHENTICATED`           | Intentar refresh una vez; si falla, cerrar sesión y llevar al login        |
| `BAD_REQUEST`               | Mostrar el `message` del backend junto al formulario (ya viene en español) |
| `NOT_FOUND`                 | Recurso inexistente o de otro usuario → estado vacío, no error rojo        |
| `CONFLICT`                  | Solo en `register`: email ya registrado                                    |
| `GRAPHQL_VALIDATION_FAILED` | Bug del cliente: query desalineada con el esquema. No mostrar al usuario   |
| `INTERNAL_SERVER_ERROR`     | Mensaje genérico + opción de reintentar                                    |

## Enums

- `TransactionKind`: `EXPENSE`, `INCOME`
- `Recurrence`: `ONCE`, `DAILY`, `WEEKLY`, `BIWEEKLY`, `MONTHLY`, `BIMONTHLY`, `QUARTERLY`, `SEMIANNUAL`, `ANNUAL`
- `UnitOfMeasure`: `UNIT`, `GRAM`, `KILOGRAM`, `MILLILITER`, `LITER`, `PACK`, `ROLL`, `PAIR`, `OTHER`
- `AuthProvider`: `LOCAL`, `GOOGLE`

Los enums se muestran traducidos al usuario, pero se envían al backend con su valor literal.

## Convención de commits

- Los commits siguen la convención de _Conventional Commits_: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`, etc.
- Los commits se hacen **a nombre del dueño del repositorio** (`LuiferEduardoo <luifer01ortegaperez@gmail.com>`), sin trailers de co-autoría.

## Desarrollo

En desarrollo, el playground de Apollo está en la misma URL del endpoint (`http://localhost:3000/graphql`) abierta en el navegador: úsalo para verificar una query antes de escribir el hook.
