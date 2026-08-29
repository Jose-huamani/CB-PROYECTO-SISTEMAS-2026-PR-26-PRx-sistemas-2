import { Routes } from '@angular/router';

import { guestGuard } from '@core/guards/guest.guard';
import { PublicLayoutComponent } from '@core/layouts/public-layout/public-layout.component';

export const SITE_ROUTES: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        title: 'Inicio',
        canActivate: [guestGuard],
        loadComponent: () =>
          import('./pages/landing-page/landing-page.component').then(
            (module) => module.LandingPageComponent,
          ),
      },
      {
        path: 'community/co-creator',
        title: 'Convertirse en Creador',
        loadComponent: () =>
          import('./pages/become-co-creator-page/become-co-creator-page.component').then(
            (m) => m.BecomeCoCreatorPageComponent,
          ),
      },
      {
        path: 'community/member',
        title: 'Convertirse en Miembro',
        loadComponent: () =>
          import('./pages/become-member-page/become-member-page.component').then(
            (m) => m.BecomeMemberPageComponent,
          ),
      },
      {
        path: 'docs',
        title: 'Documentación',
        loadComponent: () =>
          import('./pages/docs-page/docs-page.component').then((m) => m.DocsPageComponent),
      },
      {
        path: 'guide',
        title: 'Guía',
        loadComponent: () =>
          import('./pages/guide-page/guide-page.component').then((m) => m.GuidePageComponent),
      },
      {
        path: 'faq',
        title: 'Preguntas Frecuentes',
        loadComponent: () =>
          import('./pages/faq-page/faq-page.component').then((m) => m.FaqPageComponent),
      },
    ],
  },
];
