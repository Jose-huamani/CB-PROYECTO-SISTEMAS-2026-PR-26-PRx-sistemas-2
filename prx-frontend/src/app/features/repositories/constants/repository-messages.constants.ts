export const REPOSITORY_MESSAGES = {
  CREATE: {
    SUCCESS: 'Repositorio creado correctamente.',
    ERROR: 'No se pudo crear el repositorio.',
  },

  UPDATE: {
    SUCCESS: 'Repositorio actualizado correctamente.',
    ERROR: 'No se pudo actualizar el repositorio.',
    UNAUTHORIZED: 'No tienes permisos para configurar este repositorio.',
    WITHOUT_CHANGES: 'No realizaste ningún cambio.',
  },

  DELETE: {
    SUCCESS: 'Repositorio eliminado correctamente.',
    ERROR: 'No se pudo eliminar el repositorio.',
    CONFIRM: (repositoryName: string) =>
      `¿Estás seguro de que deseas eliminar el repositorio "${repositoryName}"? Esta acción no se puede deshacer.`,
  },

  DETAIL: {
    ERROR: 'No se pudo cargar el repositorio.',
    INVALID_ID: 'El identificador del repositorio no es válido.',
  },

  CATEGORIES: {
    ERROR: 'No se pudieron cargar las categorías.',
    EMPTY: 'No se encontraron categorías.',
  },

  LIST: {
    ERROR: 'No se pudieron cargar los repositorios.',
    ROLES_ERROR: 'No se pudieron cargar los roles.',
    DEFAULT_SUBTITLE:
      'Consulta todos los repositorios donde participas, sin importar tu rol dentro de cada espacio.',
    EMPTY_TITLE: 'No se encontraron repositorios',
    EMPTY_DESCRIPTION: 'Ajusta los filtros o intenta con otra búsqueda.',
  },

  EXPLORE: {
    ERROR: 'No se pudieron cargar los repositorios públicos.',
    TITLE: 'Explorar repositorios',
    SUBTITLE:
      'Descubre repositorios públicos compartidos por otros usuarios y encuentra recursos útiles para tus proyectos.',
    EMPTY_TITLE: 'No se encontraron repositorios públicos',
    EMPTY_DESCRIPTION: 'Ajusta los filtros o intenta con otra búsqueda.',
  },

  PUBLIC_BY_USER: {
    ERROR: 'No se pudieron cargar los repositorios públicos.',
    EMPTY_TITLE: 'Sin repositorios públicos',
    EMPTY_DESCRIPTION: 'Este usuario aún no tiene repositorios públicos para mostrar.',
  },

  TEAM: {
    PROMOTE_OWNER: (username: string) =>
      `¿Estás seguro que deseas transferir la propiedad a ${username}? Tú pasarás a ser Copropietario.`,
    PROMOTE_COOWNER: (username: string) =>
      `¿Estás seguro que deseas ascender a ${username} a Copropietario?`,
    DEMOTE: (username: string) => `¿Estás seguro que deseas descender a ${username} a Cocreador?`,
    SUCCES: 'Función actualizada correctamente.',
    INVITATION_SUCCESS: 'Invitación enviada correctamente.',
  },

  WARN: {
    CANNOT_DEMOTE_SELF: 'No puedes auto-descenderte.',
    CANNOT_PROMOTE_SELF: 'No puedes auto-ascenderte.',
    CANNOT_REMOVE_SELF: 'No puedes auto-eliminarte desde este panel.',
    ACCESS_DENIED: 'Acción denegada',
  },

  USER: {
    NOT_FOUND: 'Usuario no encontrado.',
    DELETE_SUCCESS: 'Usuario eliminado del repositorio correctamente.',
    UPDATE_ROLE: (targetRoleName: string) => `Usuario asignado como ${targetRoleName}.`,
  },
} as const;
