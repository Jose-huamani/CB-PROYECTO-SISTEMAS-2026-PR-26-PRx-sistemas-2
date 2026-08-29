import { Routes } from '@angular/router';

import { authGuard } from '@core/guards/auth.guard';
import { PublicLayoutComponent } from '@core/layouts/public-layout/public-layout.component';

export const PROFILES_ROUTES: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'edit',
        pathMatch: 'full',
      },
      {
        path: 'view/:id',
        title: 'Perfil Público',
        loadComponent: () =>
          import('./pages/profile-public-page/profile-public-page.component').then(
            (module) => module.ProfilePublicPageComponent,
          ),
      },
      {
        path: 'edit',
        title: 'Editar Perfil',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/edit-profile-page/edit-profile-page.component').then(
            (module) => module.EditProfilePageComponent,
          ),
      },
    ],
  },
];
