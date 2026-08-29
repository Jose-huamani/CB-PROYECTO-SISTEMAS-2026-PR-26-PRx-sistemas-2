import { Routes } from '@angular/router';

import { authGuard } from '@core/guards/auth.guard';
import { guestGuard } from '@core/guards/guest.guard';
import { requireQueryParamsGuard } from '@core/guards/query-param.guard';
import { AuthLayoutComponent } from '@core/layouts/auth-layout/auth-layout.component';
import { AUTH_LAYOUT_IMAGES } from '@core/layouts/auth-layout/auth-layout-images.constants';
import { PublicLayoutComponent } from '@core/layouts/public-layout/public-layout.component';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        title: 'Iniciar sesión',
        canActivate: [guestGuard],
        data: {
          authLayoutImages: AUTH_LAYOUT_IMAGES.AUTH_ENTRY,
        },
        loadComponent: () =>
          import('./pages/login-page/login-page.component').then(
            (module) => module.LoginPageComponent,
          ),
      },
      {
        path: 'register-request',
        title: 'Registrarse',
        canActivate: [guestGuard],
        data: {
          authLayoutImages: AUTH_LAYOUT_IMAGES.AUTH_ENTRY,
        },
        loadComponent: () =>
          import('./pages/register-request-page/register-request-page.component').then(
            (module) => module.RegisterRequestPageComponent,
          ),
      },
      {
        path: 'confirm-register',
        title: 'Confirmar registro',
        canActivate: [guestGuard, requireQueryParamsGuard('email', '/auth/register-request')],
        data: {
          authLayoutImages: AUTH_LAYOUT_IMAGES.AUTH_RECOVERY,
        },
        loadComponent: () =>
          import('./pages/confirm-register-page/confirm-register-page.component').then(
            (module) => module.ConfirmRegisterPageComponent,
          ),
      },
      {
        path: 'forgot-password',
        title: 'Olvidé mi contraseña',
        canActivate: [guestGuard],
        data: {
          authLayoutImages: AUTH_LAYOUT_IMAGES.AUTH_RECOVERY,
        },
        loadComponent: () =>
          import('./pages/forgot-password-page/forgot-password-page.component').then(
            (module) => module.ForgotPasswordPageComponent,
          ),
      },
      {
        path: 'reset-password',
        title: 'Restablecer contraseña',
        canActivate: [guestGuard, requireQueryParamsGuard('email', '/auth/forgot-password')],
        data: {
          authLayoutImages: AUTH_LAYOUT_IMAGES.AUTH_RECOVERY,
        },
        loadComponent: () =>
          import('./pages/reset-password-page/reset-password-page.component').then(
            (module) => module.ResetPasswordPageComponent,
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
        path: 'change-password',
        title: 'Cambiar contraseña',
        loadComponent: () =>
          import('./pages/change-password-page/change-password-page.component').then(
            (module) => module.ChangePasswordPageComponent,
          ),
      },
    ],
  },
];
