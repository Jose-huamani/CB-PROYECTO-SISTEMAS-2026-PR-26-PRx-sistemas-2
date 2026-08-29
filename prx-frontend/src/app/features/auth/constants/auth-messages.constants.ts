export const AUTH_MESSAGES = {
  LOGIN: {
    SUCCESS: 'Inicio de sesión exitoso. Bienvenido a PRX.',
    ERROR: 'No se pudo iniciar sesión. Verifica tus credenciales.',
  },

  REGISTER_REQUEST: {
    SUCCESS: 'Te enviamos un código para continuar con tu registro.',
    ERROR: 'No se pudo completar la solicitud de registro.',
  },

  CONFIRM_REGISTER: {
    SUCCESS: 'Tu cuenta fue creada correctamente.',
    ERROR: 'No se pudo confirmar el registro.',
    EMAIL_NOT_FOUND: 'No se encontró el correo asociado al registro.',
  },

  RESEND_VERIFICATION_CODE: {
    SUCCESS: 'Se envió nuevamente el código de verificación.',
    ERROR: 'No se pudo reenviar el código.',
    EMAIL_NOT_FOUND: 'No se encontró el correo para reenviar el código.',
  },

  FORGOT_PASSWORD: {
    SUCCESS: 'Te enviamos un código para recuperar tu cuenta.',
    ERROR: 'No se pudo enviar el código de recuperación.',
  },

  RESET_PASSWORD: {
    SUCCESS: 'Tu contraseña fue actualizada correctamente.',
    ERROR: 'No se pudo restablecer la contraseña.',
    EMAIL_NOT_FOUND: 'No se encontró el correo para la recuperación.',
  },

  CHANGE_PASSWORD: {
    SUCCESS: 'Tu contraseña fue cambiada correctamente.',
    ERROR: 'No se pudo cambiar la contraseña.',
  },

  LOGOUT: {
    SUCCESS: 'Cerraste sesión correctamente.',
  },
} as const;
