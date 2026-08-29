export const NotificationType = {
  invitacion_repositorio: 'invitacion_repositorio',
} as const;

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];
