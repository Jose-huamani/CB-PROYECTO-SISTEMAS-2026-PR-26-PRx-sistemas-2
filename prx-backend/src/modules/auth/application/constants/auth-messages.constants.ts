export const AUTH_MESSAGES = {
  REGISTER_REQUEST_SENT:
    'Te enviamos un código para continuar con tu registro.',
  REGISTER_CONFIRMED: 'Tu cuenta fue creada correctamente.',

  LOGIN_SUCCESS: 'Inicio de sesión exitoso. Bienvenido a PRX.',
  LOGOUT_SUCCESS: 'Cerraste sesión correctamente.',

  PASSWORD_RESET_SENT: 'Te enviamos un código para recuperar tu cuenta.',
  PASSWORD_RESET_SUCCESS: 'Tu contraseña fue actualizada correctamente.',
  PASSWORD_CHANGED_SUCCESS: 'Tu contraseña fue cambiada correctamente.',

  INVALID_CREDENTIALS: 'El correo o la contraseña no son correctos.',
  INVALID_CURRENT_PASSWORD: 'La contraseña actual no es correcta.',
  PASSWORD_MUST_BE_DIFFERENT:
    'La nueva contraseña debe ser diferente a la actual.',
  INVALID_OR_EXPIRED_CODE:
    'El código es inválido o ha expirado. Solicita uno nuevo.',

  UNAUTHORIZED: 'Tu sesión ha expirado. Inicia sesión nuevamente.',
  FORBIDDEN: 'No tienes permisos para realizar esta acción.',

  TOKEN_EXPIRED: 'Tu sesión ha expirado. Inicia sesión nuevamente.',
  INVALID_TOKEN: 'La sesión no es válida. Vuelve a iniciar sesión.',
} as const;
