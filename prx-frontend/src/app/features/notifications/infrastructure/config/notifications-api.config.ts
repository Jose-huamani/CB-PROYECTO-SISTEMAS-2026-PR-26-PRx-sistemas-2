export const NOTIFICATIONS_API_CONFIG = {
  base: '/notifications',
  endpoints: {
    me: '/me',
    unreadCount: '/me/unread-count',
    read: '/read',
    byId: '/:id',
  },
} as const;
