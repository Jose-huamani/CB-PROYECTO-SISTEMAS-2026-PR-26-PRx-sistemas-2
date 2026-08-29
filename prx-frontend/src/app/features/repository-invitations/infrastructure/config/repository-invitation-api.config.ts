export const REPOSITORY_INVITATION_API_CONFIG = {
  base: '/repository-invitations',
  endpoints: {
    create: '/:repositoryId',
    findById: '/:id',
    accept: '/:id/accept',
    reject: '/:id/reject',
  },
} as const;
