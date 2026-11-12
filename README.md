# Inventory Flow

Aplicación móvil de control de inventario construida con React Native + Expo (JavaScript). Reproduce el flujo y la paleta del wireframe de Figma: inicio de sesión, resumen, inventario, detalle de producto, registro de movimientos y alta de productos.

## Requisitos

- Node.js 20 o superior
- La app **Expo Go** instalada en tu teléfono (Android o iOS)
- Teléfono y computadora en la misma red Wi-Fi

## Cómo ejecutar

```bash
cd inventory-flow
npm install
npm start
```

Escanea el código QR que aparece en la terminal con Expo Go (Android) o con la cámara del iPhone (iOS).

Si el servidor no detecta tu red, usa:

```bash
npx expo start --tunnel
```

## Cuenta de acceso

Puedes entrar con cualquier correo válido y una contraseña de 6 o más caracteres. Para la demostración:

- **Correo:** `ana.garcia@inventoryflow.com`
- **Contraseña:** `admin123`

También hay un botón **«Probar con cuenta demo»** en la pantalla de acceso.

## Funcionalidad

- **Inicio:** indicadores de productos, unidades y categorías; alerta de bajo stock; últimos movimientos; acceso a alertas y registro de movimientos.
- **Inventario:** búsqueda por nombre/SKU, filtro por bajo stock y categoría, ordenamiento, escáner de código de barras (con entrada manual de SKU), alta de productos.
- **Detalle de producto:** nivel de stock con medidor, datos, historial del producto, editar, eliminar y registrar movimientos.
- **Movimientos:** historial completo, filtros por entrada/salida y producto, búsqueda por motivo/nota.
- **Registrar movimiento:** entrada o salida, cantidad, motivo, nota, vista previa del stock resultante y validación de existencias.
- **Añadir/editar producto:** foto opcional, nombre, SKU único, categoría, descripción, precio, stock, mínimo y ubicación.
- **Alertas:** listado de productos por debajo del mínimo con acceso directo a su detalle.
- **Cuenta:** perfil, estadísticas, interruptor de alertas y cierre de sesión.
- **Persistencia:** los productos, movimientos, preferencias y la sesión se guardan con AsyncStorage. Los cambios de stock generan movimientos automáticos de ajuste.

## Paleta

Se respetan exactamente los colores del diseño:

| Uso | Color |
| --- | --- |
| Fondo | `#F8FAFC` |
| Superficie | `#FFFFFF` |
| Texto principal | `#0F172A` |
| Texto secundario | `#1E293B` |
| Texto atenuado | `#64748B` |
| Placeholder / iconos inactivos | `#94A3B8` |
| Bordes | `#E2E8F0` |
| Alerta de fondo | `#FFFBEB` |
| Alerta de borde | `#FDE68A` |
| Alerta de texto | `#B45309` |
| Ámbar | `#F59E0B` |
| Éxito de fondo | `#ECFDF5` |
| Éxito de texto | `#047857` |
| Verde | `#10B981` |

## Estructura

```
App.js                     carga de fuentes y proveedores
src/theme.js               paleta, tipografía, radios y medidas
src/context/AppContext.js  estado, persistencia y reglas de inventario
src/data/seed.js           128 productos, 8 categorías y movimientos de ejemplo
src/navigation/            pila raíz, pestañas y barra inferior
src/screens/               pantallas de la aplicación
src/components/            componentes reutilizables
src/utils/format.js        formato de fechas, moneda y stock
```

## Notas

- La cámara requiere permiso; si se niega, el escáner permite escribir el SKU manualmente.
- La primera vez se cargan datos de demostración (128 productos, 1.240 unidades y 6 alertas de stock). Los cambios posteriores se conservan en el dispositivo.
