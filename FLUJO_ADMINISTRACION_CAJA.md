# Agua Santa María — Administración y Caja

## Separación de responsabilidades

Administración y Caja son perfiles independientes. No comparten navegación ni permisos operativos.

- **Administración** supervisa el padrón, la operación de campo, las incidencias y los resultados.
- **Caja** localiza cuentas, valida recibos pendientes, registra pagos y entrega comprobantes.

Administración puede consultar la recaudación confirmada, pero no puede registrar cobros. Una cuenta con adeudo muestra que el pago debe atenderse desde una sesión de Caja.

## Módulos de Administración

### Inicio

Responde cuatro preguntas operativas:

1. ¿Cuánto se ha recaudado en el periodo?
2. ¿Cuánto permanece pendiente de cobro?
3. ¿Qué casos requieren decisión administrativa?
4. ¿Cuál es el avance real de campo?

También muestra actividad de pagos en modo consulta, estado del padrón y registros de campo pendientes de sincronización.

### Cuentas

Permite buscar por cuenta, titular, domicilio, toma o medidor; filtrar por estado; consultar recibos y datos de servicio; y crear nuevas cuentas.

El alta valida como únicos:

- número de cuenta;
- número de toma;
- medidor;
- código de activación.

La existencia de adeudos no habilita cobros dentro de Administración.

### Operación de campo

Permite asignar rutas por periodo, sector y responsable, evitando dos asignaciones activas para el mismo sector y periodo.

El seguimiento distingue visitas pendientes, completadas, incidencias, lecturas en revisión y ausencias. Administración consulta el estado de sincronización, pero el envío debe completarse desde el dispositivo de campo.

### Incidencias

Concentra consumos atípicos, incidencias y ausencias. Desde el detalle se puede:

- validar una lectura revisada;
- programar una revisita;
- cerrar una incidencia cuando corresponda.

Mientras una lectura permanezca en revisión no se genera un adeudo.

### Reportes

Consulta únicamente pagos confirmados. Permite filtrar por periodo y canal, imprimir la vista y descargar un CSV compatible con hojas de cálculo.

## Flujo independiente de Caja

`Acceso de Caja → localizar cuenta → verificar titular y domicilio → seleccionar recibo → registrar efectivo o terminal → generar comprobante`

La ruta de trabajo es `/cashier/pos` y requiere una sesión con rol `cashier`. Los pagos guardan el nombre del operador y la ventanilla activa.

## Estado compartido

El prototipo conserva información en `localStorage` para conectar los recorridos:

- un pago registrado en Caja aparece en los reportes administrativos;
- una ruta creada permanece disponible al navegar;
- una resolución administrativa actualiza el estado utilizado por Campo.

En producción este estado debe sustituirse por una API, base de datos transaccional, permisos por rol y bitácora de auditoría.
