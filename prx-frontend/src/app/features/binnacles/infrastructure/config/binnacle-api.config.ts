export const BINNACLE_API_CONFIG = {
  base: '/binnacles',
  endpoints: {
    findPaginatedMe: '/me',
    create: '/',
    delete: '/:id',
  },
} as const;
