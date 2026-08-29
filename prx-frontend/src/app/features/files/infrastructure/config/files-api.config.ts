export const FILES_API_CONFIG = {
  base: '/files',

  endpoints: {
    findExplorerContent: '/repositories/:repositoryId/explorer',
    createFile: '/',
    downloadFile: '/:id/download',
    deleteFile: '/:id',
    createFolder: '/folders',
    updateFolder: '/folders/:id',
    deleteFolder: '/folders/:id',
  },
} as const;
