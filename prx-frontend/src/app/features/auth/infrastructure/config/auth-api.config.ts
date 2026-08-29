export const AUTH_API_CONFIG = {
  base: '/auth',

  endpoints: {
    login: '/login',
    logout: '/logout',
    refresh: '/refresh',
    me: '/me',

    registerRequest: '/register-request',
    confirmRegister: '/confirm-register',
    resendVerificationCode: '/resend-verification-code',

    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    changePassword: '/change-password',
  },
} as const;
