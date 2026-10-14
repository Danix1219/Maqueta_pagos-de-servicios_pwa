# Flujo de activación — Habitante

## Objetivo
Permitir que un habitante vincule una cuenta de servicio existente al acceso digital sin exponer datos personales antes de validar que posee el código entregado por administración.

## Flujo del prototipo

1. **Identificación de cuenta**
   - Cuenta de servicio `SMM-000000`.
   - Código de activación entregado por administración.
   - Validación de formato y relación cuenta/código.
   - Si falla, se muestra un error neutro sin revelar datos del titular.

2. **Confirmación de identidad**
   - Sólo después de validar cuenta + código se muestran titular y domicilio.
   - El usuario elige un contacto previamente registrado: SMS o correo.
   - Se envía OTP de 6 dígitos.
   - Temporizador para reenvío y validación del código.

3. **Creación de contraseña**
   - Mínimo 8 caracteres.
   - Mayúscula, minúscula, número y carácter especial.
   - Confirmación de contraseña.
   - Aceptación del aviso de privacidad y condiciones.

4. **Activación exitosa**
   - La cuenta queda marcada como activada.
   - Se redirige al inicio de sesión.
   - El usuario ya puede ingresar con cuenta + contraseña.

## Reglas necesarias para producción

- Código de activación de un solo uso, con fecha de expiración.
- Código almacenado en backend mediante hash, nunca en texto plano.
- Protección contra enumeración de cuentas: respuestas neutras ante errores.
- Rate limiting por cuenta, IP y dispositivo.
- OTP temporal y con número máximo de intentos.
- Bloqueo temporal y registro de eventos sospechosos.
- Contraseñas procesadas con un algoritmo de hash adecuado para credenciales (Argon2id/bcrypt según la arquitectura final).
- Sesiones emitidas únicamente por backend.
- Registro de auditoría de activación, recuperación y cambios de contacto.
- Los datos de contacto sólo pueden modificarse mediante un flujo de identidad separado, no durante la activación sin controles adicionales.

## Datos de demostración

- Cuenta: `SMM-001245`
- Código de activación: `ASM-8264`
- OTP: `246810`
- Login demo: `SMM-001245`
- Contraseña demo del login actual: `Agua2026!`
