# Agua Santa María PWA — Administración + Caja

Versión acumulativa del prototipo. Conserva Habitante, recuperación de contraseña, pago en línea y Personal de Campo, y completa el escritorio de **Administración y Caja**.

## Ejecutar

```bash
npm install
npm run dev
```

## Probar Caja

1. Seleccionar `Administración y Caja` desde la portada.
2. Abrir `Caja`.
3. Elegir **Búsqueda manual** o **Escanear código**.

### Cuenta principal de demostración

- Cuenta: `SMM-001245`
- Titular: María Hernández López
- Domicilio: Morelos 24, Centro
- Recibo pendiente: Septiembre 2026 · $150.00

### Escaneo

En Habitante:

`Inicio → Pago en oficina`

La pantalla muestra un código Code 39 generado para `SMM-001245`.

En Caja:

`Escanear código → Activar cámara`

El prototipo intenta leerlo mediante `BarcodeDetector` si el navegador ofrece esa API. Como compatibilidad, también permite capturar el valor impreso y dispone de una simulación de escaneo válida/incorrecta.

## Flujo de cobro

`Localizar → confirmar cuenta → seleccionar recibo → forma de pago → validar → registrar → comprobante`

Formas de pago de ventanilla implementadas:
- Efectivo, con cálculo de cambio y bloqueo por importe insuficiente.
- Terminal bancaria, con autorización/referencia simulada antes de registrar.

Los cobros actualizan el estado persistido y aparecen en **Reportes**.

## Administración

- Resumen operativo funcional.
- Gestión y alta de cuentas con validación de duplicados.
- Código de activación visible en detalle de cuenta.
- Preparación y asignación de rutas.
- Seguimiento conectado al estado del rol Campo.
- Bandeja de incidencias y lecturas atípicas.
- Validar lectura / programar revisita / cerrar incidencia.
- Reportes por periodo y método.
- Exportación CSV real desde el navegador.

Consulta `FLUJO_ADMINISTRACION_CAJA.md` para el recorrido funcional detallado.

## Accesos internos actualizados

La versión consolidada separa Administración, Caja y Personal de campo desde el selector de roles.

- Habitante: `SMM-001245` / contraseña inicial `Agua2026!`
- Personal de campo: `CAM-014` / PIN `2468`
- Administración: `ADM-001` / `Admin2026!`
- Caja: `CAJ-007` / PIN `4826`

Administración y Caja ya no comparten la misma entrada. El rol Caja se restringe al módulo de cobro dentro del prototipo y el rol Administración conserva el acceso completo a los módulos operativos.
