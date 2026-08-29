export const REPOSITORY_API_CONFIG = {
  base: '/repositories',

  endpoints: {
    create: '/',
    findCategories: '/categories',
    findRoles: '/roles',
    findMe: '/me',
    findExplore: '/explore',
    findMeIntimate: '/me/intimate',
    findPublicByUser: '/users/:userId/public',
    findById: '/:id',
    findUsers: '/:id/users',
    update: '/:id',
    delete: '/:id',
    sendInvitation: '/:id/invitations',
    findFunctions: '/functions',
    updateUser: '/:id/users/:userId',
    deleteUser: '/:id/users/:userId',
  },
} as const;
