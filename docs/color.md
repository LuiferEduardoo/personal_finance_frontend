# Sistema de color

Los tokens viven en [src/styles/theme.css](../src/styles/theme.css). Este documento explica **por qué** son esos valores, para que nadie los cambie a ojo.

## Dos familias separadas

| Familia       | Tokens                                    | Para qué                                     |
| ------------- | ----------------------------------------- | -------------------------------------------- |
| **Semántica** | `income`, `expense`, `warning`, `neutral` | Estado del dinero. Reservados: nunca decoran |
| **Chrome**    | `surface*`, `border`, `ink*`              | La interfaz. Escala neutra, sin color        |

Si la interfaz usa verde y rojo para botones y bordes, los mismos colores dejan de significar "entra dinero" / "sale dinero". Por eso el chrome es neutro.

## Valores

| Rol       | Claro     | Oscuro    |
| --------- | --------- | --------- |
| `income`  | `#0f8f5f` | `#199e70` |
| `expense` | `#e34948` | `#e34948` |
| `warning` | `#eda100` | `#c98500` |
| `neutral` | `#2a78d6` | `#3987e5` |

## Cómo se eligieron

Con el validador de la skill `dataviz`, que comprueba banda de luminosidad, suelo de croma, separación bajo daltonismo, suelo de visión normal y contraste contra la superficie:

```
node scripts/validate_palette.js "#0f8f5f,#e34948,#eda100,#2a78d6" --mode light --pairs all
node scripts/validate_palette.js "#199e70,#e34948,#c98500,#3987e5" --mode dark --surface "#1a1a19" --pairs all
```

Ambos pasan. Dos hallazgos que motivaron el resultado:

1. **El coral claro falla en modo oscuro.** La elección intuitiva (`#e66767`, un coral suave) queda a ΔE 13.0 del ámbar — por debajo del piso de 15, o sea **indistinguible incluso con visión normal**. Se corrigió oscureciéndolo a `#e34948` (ΔE 15.1). Cualquier ámbar más brillante que también lo resolviera se sale de la banda de luminosidad del modo oscuro. Es una esquina estrecha.
2. **Verde y coral rozan el límite bajo daltonismo**: ΔE 8.3 en claro (pasa justo el objetivo de 8), 6.2 en oscuro (banda de aviso, legal _solo_ con codificación secundaria). Y esa es la distinción central de la aplicación.

## La regla que se deriva

**Ingreso vs. gasto nunca se distingue solo por color.** Es lo que hace legal el 6.2 del punto anterior. Todo importe lleva:

- signo explícito `+` / `−` (menos tipográfico U+2212, no guion ASCII);
- icono direccional;
- en gráficos: etiqueta directa o leyenda, y separador de 2px entre rellenos contiguos.

Esto está implementado en [src/components/Money.tsx](../src/components/Money.tsx). **Usar ese componente para todo importe**, no un `<span className="text-income">` a mano.

La prueba: poner la vista en escala de grises con el filtro de DevTools. Si ingresos y gastos se confunden, falta el signo o el icono — no es que el color esté mal elegido.

## Desglose por categoría

Barras horizontales ordenadas por magnitud, **todas del mismo tono** (`neutral`), con etiqueta directa. No un donut multicolor:

- las categorías son identidad nominal; colorearlas gasta el canal de color repitiendo lo que la longitud de la barra ya dice;
- los cuatro colores semánticos están reservados, así que un donut necesitaría una paleta categórica aparte que compite visualmente con ellos;
- en móvil las etiquetas de un donut no caben; en barras horizontales, sí;
- un donut se rompe a las 6 categorías; las barras escalan a 20.

## Si hay que cambiar un valor

Volver a ejecutar el validador en **ambos modos** con `--pairs all` antes de tocar `theme.css`. Los cuatro colores se validan como conjunto: cambiar uno puede romper la separación de otro par.
