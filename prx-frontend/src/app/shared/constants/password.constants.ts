export const PASSWORD_STRONG_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/;

export const PASSWORD_STRENGTH_LABELS = {
  prompt: 'Ingresa una contraseña',
  weak: 'Débil',
  medium: 'Media',
  strong: 'Fuerte',
} as const;

export const PASSWORD_REQUIREMENTS: string[] = [
  'Al menos una letra minúscula',
  'Al menos una letra mayúscula',
  'Al menos un número',
  'Al menos un carácter especial',
  'Mínimo 8 caracteres',
];
