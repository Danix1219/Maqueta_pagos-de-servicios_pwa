# Accesos internos · Agua Santa María

Esta versión separa los accesos de Personal de campo, Administración y Caja para representar mejor el producto final.

## Personal de campo

**Ruta:** `/field/login`

1. Identificación con ID de empleado.
2. PIN operativo de cuatro dígitos.
3. Validación de jornada activa.
4. Asociación de la sesión al dispositivo de trabajo.
5. Acceso a ruta, domicilios, pendientes y sincronización.
6. Al cerrar sesión se elimina la sesión operativa del dispositivo.

**Datos de demostración:** `CAM-014` / `2468`.

## Administración

**Ruta:** `/admin/login`

1. Usuario administrativo.
2. Contraseña.
3. Validación de acceso.
4. Control demostrativo de intentos fallidos.
5. Creación de sesión administrativa.
6. Acceso a Resumen, Cuentas, Operación, Caja, Incidencias y Reportes.

**Datos de demostración:** `ADM-001` / `Admin2026!`.

## Caja

**Ruta:** `/cashier/login`

1. ID de cajero.
2. PIN de cuatro dígitos.
3. Validación de la terminal/punto de cobro asignado.
4. Creación de sesión exclusiva de Caja.
5. El rol de cajero sólo puede acceder al módulo de cobro.
6. Cada operación queda asociada visualmente al operador y caja activos.

**Datos de demostración:** `CAJ-007` / `4826`.

## Separación de permisos simulada

El prototipo usa `sessionStorage` para representar sesiones y separación de roles. No sustituye autenticación real. En producción se debe usar autenticación del backend, tokens de sesión, autorización por roles/permisos, expiración, bitácora y políticas de bloqueo.
