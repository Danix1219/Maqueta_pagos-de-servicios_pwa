# Flujo funcional — Recuperación de contraseña del Habitante

## Objetivo

Permitir que un habitante recupere el acceso sin intervención manual cuando todavía conserva acceso a un medio de contacto previamente registrado.

## Journey implementado

```text
Login
  │
  └── ¿La olvidaste?
          │
          ▼
1. Validar cuenta de servicio
          │
          ▼
2. Seleccionar contacto registrado
   ├── SMS •••• •• 4821
   └── Correo m••••@correo.mx
          │
          ▼
3. Enviar OTP de 6 dígitos
   ├── Expira en 5 minutos
   ├── Reenvío con cooldown de 60 s
   ├── Máximo 3 reenvíos
   └── Máximo 5 intentos por código
          │
          ▼
4. OTP válido
          │
          ▼
5. Crear nueva contraseña
   ├── 8+ caracteres
   ├── Mayúscula
   ├── Minúscula
   ├── Número
   ├── Carácter especial
   ├── Diferente a la contraseña anterior
   └── Confirmación idéntica
          │
          ▼
6. Actualización confirmada
          │
          ▼
7. Volver al login
```

## Escenario demo

| Dato | Valor |
|---|---|
| Cuenta | `SMM-001245` |
| Contraseña anterior | `Agua2026!` |
| OTP | `731942` |
| SMS mostrado | `•••• •• 4821` |
| Correo mostrado | `m••••@correo.mx` |

## Estados y validaciones incorporados

### Validación de cuenta

- El campo exige `SMM-000000`.
- No se muestran datos personales completos antes del siguiente paso.
- El error de cuenta mantiene un mensaje controlado.

### OTP

- Selección de SMS o correo ya registrado.
- Código numérico de 6 dígitos.
- Vigencia visual de 5 minutos.
- Cooldown de 60 segundos antes de reenviar.
- Hasta 3 reenvíos.
- Hasta 5 intentos incorrectos por código.
- Un reenvío reinicia los intentos del OTP vigente.

### Nueva contraseña

- Medidor visual de fortaleza.
- Reglas visibles y reactivas.
- Confirmación independiente con mostrar/ocultar.
- La clave no puede coincidir con la anterior del prototipo.
- Al guardar, se elimina la sesión recordada (`smm_demo_session`).

### Confirmación final

- Confirma que la contraseña fue actualizada.
- Muestra la cuenta y fecha/hora del cambio.
- Indica qué hacer si el usuario no reconoce la operación.
- Regresa al login con un aviso de éxito.

## Implementación de producción recomendada

El prototipo reproduce el journey; en producción la seguridad debe quedar en servidor:

1. `POST /auth/password-recovery/request`
   - Recibe cuenta.
   - Responde de forma uniforme para evitar enumeración de cuentas.
   - Devuelve únicamente destinos enmascarados cuando la política lo permita.

2. `POST /auth/password-recovery/send-otp`
   - Genera OTP criptográficamente aleatorio.
   - Guarda hash del OTP y expiración.
   - Aplica rate limiting por cuenta, IP y dispositivo.

3. `POST /auth/password-recovery/verify-otp`
   - Controla intentos y expiración.
   - Devuelve un `reset_token` de vida corta y un solo uso.

4. `POST /auth/password-recovery/reset`
   - Requiere `reset_token`.
   - Valida política e historial de contraseñas.
   - Almacena hash Argon2id/bcrypt según la arquitectura definida.
   - Revoca el token de recuperación y sesiones según política.

5. Auditoría
   - Registrar fecha, cuenta, canal, resultado y metadatos de seguridad sin almacenar OTP ni contraseña.
   - Notificar al usuario del cambio por un canal registrado.
