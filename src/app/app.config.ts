import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { NzModalModule } from 'ng-zorro-antd/modal'
import { appInterceptor } from './app.interceptor'

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideNzI18n(en_US),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([appInterceptor])),
    importProvidersFrom(
      NzModalModule,
    ),
  ],
};
