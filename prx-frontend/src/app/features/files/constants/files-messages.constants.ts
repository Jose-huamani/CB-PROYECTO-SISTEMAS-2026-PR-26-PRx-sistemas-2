export const FILES_MESSAGES = {
  EXPLORER: {
    ERROR: 'No se pudo cargar el explorador de archivos.',
  },

  CREATE_FOLDER: {
    SUCCESS: 'Carpeta creada correctamente.',
    ERROR: 'No se pudo crear la carpeta.',
  },

  UPDATE_FOLDER: {
    SUCCESS: 'Carpeta actualizada correctamente.',
    ERROR: 'No se pudo actualizar la carpeta.',
  },

  DELETE_FOLDER: {
    SUCCESS: 'Carpeta eliminada correctamente.',
    ERROR: 'No se pudo eliminar la carpeta.',
    CONFIRM: '¿Estás seguro de que deseas eliminar esta carpeta?',
  },

  CREATE_FILE: {
    SUCCESS: 'Archivo creado correctamente.',
    ERROR: 'No se pudo subir el archivo.',
  },

  DELETE_FILE: {
    SUCCESS: 'Archivo eliminado correctamente.',
    ERROR: 'No se pudo eliminar el archivo.',
    CONFIRM: '¿Estás seguro de que deseas eliminar este archivo?',
  },

  DOWNLOAD_FILE: {
    ERROR: 'No se pudo generar el enlace de descarga.',
  },
} as const;
