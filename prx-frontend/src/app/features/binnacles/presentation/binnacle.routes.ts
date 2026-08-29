import { Routes } from '@angular/router';

import { authGuard } from '@core/guards/auth.guard';
import { PublicLayoutComponent } from '@core/layouts/public-layout/public-layout.component';

export const BINNACLES_ROUTES: Routes = [
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
        title: 'Mis Bitácoras',
        loadComponent: () =>
          import('./pages/binnacle-page.component').then((module) => module.BinnaclePageComponent),
      },
    ],
  },
];
