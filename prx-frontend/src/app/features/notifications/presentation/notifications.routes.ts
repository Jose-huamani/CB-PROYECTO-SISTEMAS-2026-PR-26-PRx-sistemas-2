import { Routes } from '@angular/router';

import { authGuard } from '@core/guards/auth.guard';
import { PublicLayoutComponent } from '@core/layouts/public-layout/public-layout.component';

export const NOTIFICATIONS_ROUTES: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'me',
        pathMatch: 'full',
      },
      {
        path: 'me',
        title: 'Mis Notificaciones',
        loadComponent: () =>
          import('./pages/notifications-page.component').then(
            (module) => module.NotificationsPageComponent,
          ),
      },
    ],
  },
];
