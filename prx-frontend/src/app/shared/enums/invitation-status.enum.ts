export const InvitationStatus = {
  pendiente: 'pendiente',
  aceptada: 'aceptada',
  rechazada: 'rechazada',
  cancelada: 'cancelada',
} as const;

export type InvitationStatus = (typeof InvitationStatus)[keyof typeof InvitationStatus];
