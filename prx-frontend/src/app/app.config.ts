import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TitleStrategy, provideRouter } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyPrimeNG } from '@ngx-formly/primeng';

import { routes } from './app.routes';

import { authInterceptor } from '@core/interceptors/auth.interceptor';
import { errorInterceptor } from '@core/interceptors/error.interceptor';
import { refreshInterceptor } from '@core/interceptors/refresh.interceptor';
import { AppTitleStrategy } from '@core/router/app-title.strategy';
import { AppThemePreset } from '@core/theme/app-theme.preset';
import { APP_FORMLY_CONFIG } from '@shared/ui/formly/formly.config';
import { APP_FORMLY_VALIDATION_CONFIG } from '@shared/ui/formly/formly-validation.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor, refreshInterceptor])),
    providePrimeNG({
      theme: {
        preset: AppThemePreset,
        options: {
          prefix: 'p',
          darkModeSelector: false,
        },
      },
      ripple: true,
      inputStyle: 'outlined',
    }),
    provideFormlyCore(withFormlyPrimeNG()),
    provideFormlyCore(APP_FORMLY_CONFIG),
    provideFormlyCore(APP_FORMLY_VALIDATION_CONFIG),
    MessageService,
    ConfirmationService,
    {
      provide: TitleStrategy,
      useClass: AppTitleStrategy,
    },
  ],
};
