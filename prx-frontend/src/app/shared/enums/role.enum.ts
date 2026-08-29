export const Role = {
  estandar: 'estandar',
  metaadministrador: 'metaadministrador',
} as const;

export type Role = (typeof Role)[keyof typeof Role];
