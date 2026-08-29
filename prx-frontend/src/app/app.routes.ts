import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/site/presentation/site.routes').then((module) => module.SITE_ROUTES),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/presentation/auth.routes').then((module) => module.AUTH_ROUTES),
  },
  {
    path: 'binnacles',
    loadChildren: () =>
      import('./features/binnacles/presentation/binnacle.routes').then(
        (module) => module.BINNACLES_ROUTES,
      ),
  },
  {
    path: 'repositories',
    loadChildren: () =>
      import('@features/repositories/presentation/repository.routes').then(
        (module) => module.REPOSITORIES_ROUTES,
      ),
  },
  {
    path: 'notifications',
    loadChildren: () =>
      import('./features/notifications/presentation/notifications.routes').then(
        (module) => module.NOTIFICATIONS_ROUTES,
      ),
  },
  {
    path: 'profiles',
    loadChildren: () =>
      import('./features/profiles/presentation/profile.routes').then(
        (module) => module.PROFILES_ROUTES,
      ),
  },
  {
    path: 'notes',
    loadChildren: () =>
      import('./features/notes/presentation/notes.routes').then(
        (module) => module.NOTES_ROUTES,
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
