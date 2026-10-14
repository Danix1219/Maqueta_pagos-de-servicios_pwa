# Flujo funcional — Personal de campo

## Objetivo

Convertir el módulo de campo en una jornada operativa continua, con navegación principal estable, captura de lecturas, validaciones, incidencias, entrega del recibo, trabajo offline y sincronización posterior.

## Navegación principal

La barra inferior aparece únicamente en las vistas de primer nivel para evitar salidas accidentales durante una captura:

- **Jornada**: resumen del turno, avance y siguiente visita.
- **Domicilios**: listado de tomas, búsqueda y filtros por estado.
- **Pendientes**: incidencias, revisiones y visitas con seguimiento.
- **Sincronizar**: conectividad, cola local y envío al servidor.

Durante flujos críticos —lectura, incidencia, emisión y entrega— se oculta la barra inferior y se utiliza navegación contextual con botón Atrás.

## Flujo principal

```text
Acceso de personal
        ↓
Inicio de jornada
        ↓
Mi jornada
        ↓
Domicilios asignados
        ↓
Detalle de toma / medidor
        ↓
Capturar lectura + evidencia
        ↓
Validación automática
   ┌────┴───────────────┐
   │                    │
Normal             Excepción
   │          ┌─────────┴──────────┐
   ↓          ↓                    ↓
Revisar   Lectura menor       Consumo atípico
   │          │                    │
   │      Recapturar /          Confirmar
   │       incidencia               │
   ↓                               ↓
Emitir recibo                 Revisión admin
   │                               │
Registrar entrega             Sin deuda emitida
   │                               │
   └───────────────┬───────────────┘
                   ↓
             Continuar ruta
                   ↓
          Pendientes / Sync
                   ↓
          Resumen de jornada
                   ↓
             Cerrar jornada
```

## Resultados de visita soportados

### Lectura normal
1. Lectura actual válida.
2. Cálculo de consumo.
3. Confirmación de lectura e importe.
4. Emisión de recibo.
5. Registro del método de entrega.
6. Visita completada.

### Lectura menor a la anterior
1. Se bloquea la emisión.
2. Se muestran lectura anterior y actual.
3. Personal puede recapturar o reportar anomalía del medidor.

### Consumo atípico
1. Se solicita confirmación física y evidencia adicional.
2. Se envía a revisión administrativa.
3. No se genera recibo ni deuda mientras está en revisión.

### Incidencia
Tipos contemplados:
- Medidor dañado o ilegible.
- Sin acceso al medidor.
- Posible fuga visible.
- Manipulación o riesgo.
- Otra incidencia.

Incluye prioridad, descripción y evidencia fotográfica.

### Habitante ausente / visita no completada
Se captura motivo, observación y si se dejó aviso. El resultado queda disponible para seguimiento o revisita.

## Modo sin conexión

El prototipo mantiene una cola local de operaciones. En una implementación final se recomienda:

- IndexedDB para almacenamiento local estructurado.
- Service Worker para soporte PWA y sincronización en segundo plano.
- Identificadores idempotentes para evitar registros duplicados.
- API de sincronización con resolución explícita de conflictos.

## Conflictos de sincronización

Cuando servidor y dispositivo tienen cambios sobre la misma toma, el sistema no sobrescribe silenciosamente. Se presenta una comparación y se permite conservar el registro de servidor o archivar la captura local como evidencia.

## Cierre de jornada

La jornada sólo puede cerrarse cuando:

- No quedan domicilios con estado pendiente.
- No quedan registros locales pendientes de sincronización.

El resumen muestra atendidas, incidencias, revisiones, pendientes y hora de inicio/cierre.

## Datos de prueba

- Empleado: `CAM-014`
- PIN: `2468`
- Ruta: `RUTA-CEN-09`
- Sector: Centro
- Periodo: Septiembre 2026
