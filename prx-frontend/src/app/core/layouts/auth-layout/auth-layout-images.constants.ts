export interface AuthLayoutImages {
  desktop: string;
  mobile: string;
  alt: string;
}

export const AUTH_LAYOUT_IMAGES = {
  AUTH_ENTRY: {
    desktop: '/images/auth/auth-entry-desktop.png',
    mobile: '/images/auth/auth-entry-mobile.png',
    alt: 'Ilustración de acceso y registro',
  },
  AUTH_RECOVERY: {
    desktop: '/images/auth/auth-recovery-desktop.png',
    mobile: '/images/auth/auth-recovery-mobile.png',
    alt: 'Ilustración de recuperación de cuenta',
  },
} as const satisfies Record<string, AuthLayoutImages>;
