export const REPOSITORY_MESSAGES = {
  CREATED: 'Repositorio creado correctamente',
  UPDATED: 'Repositorio actualizado correctamente',
  DELETED: 'Repositorio eliminado correctamente',
  NAME_ALREADY_EXISTS: 'Ya existe un repositorio con ese nombre',
  OWNER_NOT_FOUND: 'No se encontro el usuario propietario del repositorio',
  NOT_FOUND: 'Repositorio no encontrado',
  INVITATION_CREATED: 'Invitación enviada correctamente',
  USER_UPDATED: 'Usuario del repositorio actualizado correctamente.',
  USER_DELETED: 'Usuario eliminado del repositorio correctamente.',
  CANNOT_INVITE_SELF: 'No puedes invitarte a ti mismo.',
  USER_ALREADY_MEMBER: 'El usuario ya es miembro de este repositorio.',
  ONLY_OWNER_CAN_DELETE:
    'Solo el propietario tiene permisos para eliminar usuarios.',
  CANNOT_UPDATE_SELF: 'No puedes modificar tus propios permisos.',
  NO_FIELDS_TO_UPDATE: 'Debe enviar al menos un campo para actualizar.',
  PENDING_INVITATION_EXISTS:
    'El usuario ya tiene una invitación pendiente para este repositorio.',
  CANNOT_UPDATE_OTHER_COOWNER:
    'Un copropietario no puede modificar a otro copropietario. Solo el propietario puede hacerlo.',
  TRANSFER_NAME_CONFLICT:
    'No se puede transferir: el usuario ya tiene un repositorio con ese nombre',
  COOWNER_LIMIT_EXCEEDED:
    'No se pueden asignar más de 2 copropietarios a este repositorio.',
} as const;
