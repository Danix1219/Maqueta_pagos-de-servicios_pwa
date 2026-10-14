# Santa María Agua PWA · Versión consolidada

Esta carpeta reúne los cambios implementados hasta el momento sobre el prototipo extraído de Figma Make.

## Habitante
- Inicio de sesión rediseñado.
- Activación de cuenta con validación, OTP, creación de contraseña y confirmación.
- Recuperación de contraseña con cuenta, OTP, nueva contraseña y confirmación final.
- Dashboard con pago en línea y pago en oficina.
- Pago en línea con captura y validación de tarjeta, confirmación, 3-D Secure simulado, procesamiento, aprobado, pendiente, rechazo y resultado incierto.
- Historial, comprobantes y estados de cuenta conectados al flujo de pago demostrativo.

## Personal de campo
- Login operativo rediseñado y protegido por sesión de demostración.
- Jornada, ruta, domicilios, toma/medidor, captura, validaciones, incidencias, ausencias, revisiones y emisión/entrega.
- Navegación inferior contextual.
- Cola de sincronización y escenarios offline.
- Resumen y cierre de jornada.

## Administración
- Login administrativo independiente.
- Dashboard operativo.
- Cuentas y alta de cuenta.
- Operación y asignación de rutas.
- Incidencias y revisiones.
- Reportes y exportación CSV.
- Acceso completo condicionado por sesión administrativa de demostración.

## Caja
- Login independiente de cajero y terminal asignada.
- Búsqueda manual y lectura de código.
- Validación de cuenta y adeudo.
- Cobro en efectivo o terminal.
- Cambio, autorización y comprobante.
- Restricción demostrativa: el rol Caja sólo accede al módulo de cobro.

## Credenciales de demostración
- Habitante: `SMM-001245` / `Agua2026!`
- Campo: `CAM-014` / PIN `2468`
- Administración: `ADM-001` / `Admin2026!`
- Caja: `CAJ-007` / PIN `4826`

## Ejecución
```bash
npm install
npm run dev
```

La autenticación, pagos y persistencia son de prototipo. Para producción deberán sustituirse por servicios backend, autorización real por roles, base de datos, proveedor de pagos, bitácoras y controles de seguridad.
