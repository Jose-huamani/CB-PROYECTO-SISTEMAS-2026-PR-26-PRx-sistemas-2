export const PROFILE_MESSAGES = {
  LOAD: {
    SUCCESS: { summary: 'Perfil', detail: 'Perfil cargado correctamente.' },
    ERROR: { summary: 'Error', detail: 'No se pudo cargar tu perfil. Intenta más tarde.' },
  },
  UPDATE: {
    SUCCESS: {
      summary: 'Perfil actualizado',
      detail: 'Tus cambios se han guardado correctamente.',
    },
    ERROR: {
      summary: 'Error al actualizar',
      detail: 'No se pudo guardar los cambios. Intenta de nuevo.',
    },
  },
  NOT_FOUND: 'Perfil no encontrado.',
};
