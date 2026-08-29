export const FILE_MESSAGES = {
  CREATED: 'Archivo creado correctamente',
  DELETED: 'Archivo eliminado correctamente',
  NAME_ALREADY_EXISTS:
    'Ya existe un archivo con ese nombre y extensión en esta ubicación',
  NOT_FOUND: 'Archivo no encontrado',
  FILE_REQUIRED: 'El archivo es obligatorio',
  FILE_EMPTY: 'El archivo no puede estar vacío',
  FILE_TOO_LARGE: 'El archivo no puede superar los 50 MB',
  CREATE_FORBIDDEN:
    'No tienes permisos para subir archivos en este repositorio',
  DOWNLOAD_FORBIDDEN: 'No tienes permisos para descargar este archivo',
  DELETE_FORBIDDEN: 'No tienes permisos para eliminar este archivo',
} as const;
