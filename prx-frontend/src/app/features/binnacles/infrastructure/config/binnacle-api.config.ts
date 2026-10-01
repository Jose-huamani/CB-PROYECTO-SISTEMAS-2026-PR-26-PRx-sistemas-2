export const BINNACLE_API_CONFIG = {
  base: '/binnacles',
  endpoints: {
    findPaginatedMe: '/me',
    create: '/',
    findById: '/:id',
    update: '/:id',
    delete: '/:id',
  },
} as const;
