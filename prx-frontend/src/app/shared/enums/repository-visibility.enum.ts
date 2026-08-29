export const RepositoryVisibility = {
  publico: 'publico',
  privado: 'privado',
  intimo: 'intimo',
} as const;

export type RepositoryVisibility = (typeof RepositoryVisibility)[keyof typeof RepositoryVisibility];
