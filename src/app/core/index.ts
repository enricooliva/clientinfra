export * from './core.module'
export * from './auth.service';
export * from './auth.guard';
export * from './base-entity';
export * from './form-state';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './token.interceptor';

/** Http interceptor providers in outside-in order */
export const HttpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ];
