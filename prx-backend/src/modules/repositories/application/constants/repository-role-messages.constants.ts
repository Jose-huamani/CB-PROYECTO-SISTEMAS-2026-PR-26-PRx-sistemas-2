export const REPOSITORY_ROLE_MESSAGES = {
  OWNER_NOT_FOUND: 'No se encontro el rol propietario para el repositorio',
  CANNOT_DELETE_OWNER:
    'No se puede eliminar al propietario del repositorio. Primero debes transferir la propiedad.',
  ROLE_NOT_FOUND: 'El rol especificado no existe.',
  ONLY_OWNER_CAN_TRANSFER:
    'Solo el propietario actual puede transferir la propiedad.',
  COOWNER_ROLE_NOT_FOUND:
    'No se encontró el rol de copropietario en el sistema.',
  COCREADOR_NOT_FOUND: 'El rol de cocreador no está configurado en el sistema.',
} as const;
