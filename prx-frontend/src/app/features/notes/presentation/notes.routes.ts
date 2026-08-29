import { Routes } from '@angular/router';

import { authGuard } from '@core/guards/auth.guard';
import { PublicLayoutComponent } from '@core/layouts/public-layout/public-layout.component';

export const NOTES_ROUTES: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'repositories/me/intimate',
        children: [
          {
            path: '',
            title: 'Notas Íntimas',
            loadComponent: () =>
              import('./pages/notes-page/notes-page.component').then(
                (module) => module.NotesPageComponent,
              ),
          },
          {
            path: 'create',
            title: 'Crear Nota',
            loadComponent: () =>
              import('./pages/create-note-page/create-note-page.component').then(
                (module) => module.CreateNotePageComponent,
              ),
          },
        ],
      },
      {
        path: 'repositories/:repositoryId',
        children: [
          {
            path: '',
            title: 'Notas del Repositorio',
            loadComponent: () =>
              import('./pages/notes-page/notes-page.component').then(
                (module) => module.NotesPageComponent,
              ),
          },
          {
            path: 'create',
            title: 'Crear Nota',
            loadComponent: () =>
              import('./pages/create-note-page/create-note-page.component').then(
                (module) => module.CreateNotePageComponent,
              ),
          },
        ],
      },
    ],
  },
];
