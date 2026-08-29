import { Routes } from '@angular/router';

import { authGuard } from '@core/guards/auth.guard';
import { PublicLayoutComponent } from '@core/layouts/public-layout/public-layout.component';

export const REPOSITORIES_ROUTES: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'explore',
        pathMatch: 'full',
      },
      {
        path: 'explore',
        title: 'Explorar Repositorios',
        loadComponent: () =>
          import('./pages/repository-explore-page/repository-explore-page.component').then(
            (module) => module.RepositoryExplorePageComponent,
          ),
      },
    ],
  },
  {
    path: '',
    component: PublicLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'create',
        title: 'Crear Repositorio',
        loadComponent: () =>
          import('./pages/create-repository-page/create-repository-page.component').then(
            (module) => module.CreateRepositoryPageComponent,
          ),
      },
      {
        path: 'me/intimate',
        title: 'Repositorio Íntimo',
        loadComponent: () =>
          import('./pages/repository-detail-page/repository-detail-page.component').then(
            (module) => module.RepositoryDetailPageComponent,
          ),
      },
      {
        path: 'me',
        title: 'Mis Repositorios',
        loadComponent: () =>
          import('./pages/me-repositories-page/me-repositories-page.component').then(
            (module) => module.MeRepositoriesPageComponent,
          ),
      },
      {
        path: ':id/settings',
        title: 'Configuración del Repositorio',
        loadComponent: () =>
          import('./pages/repository-settings-page/repository-settings-page.component').then(
            (module) => module.RepositorySettingsPageComponent,
          ),
      },
      {
        path: ':id/team',
        title: 'Equipo del Repositorio',
        loadComponent: () =>
          import('./pages/repository-team-settings-page/repository-team-settings-page.component').then(
            (m) => m.RepositoryTeamSettingsPageComponent,
          ),
      },
      {
        path: ':id',
        title: 'Detalle del Repositorio',
        loadComponent: () =>
          import('./pages/repository-detail-page/repository-detail-page.component').then(
            (module) => module.RepositoryDetailPageComponent,
          ),
      },
    ],
  },
];
