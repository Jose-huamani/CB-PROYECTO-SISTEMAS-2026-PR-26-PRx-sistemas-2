export const NOTE_API_CONFIG = {
  base: '/notes',
  endpoints: {
    findByRepository: '/repository/:repositoryId',
    create: '/repository/:repositoryId',
    deleteById: '/:id',
    downloadFile: '/files/:id/download',
  },
} as const;
