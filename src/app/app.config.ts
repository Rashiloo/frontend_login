import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // Importa esto
import { authInterceptor } from './interceptors/auth-interceptor'; // Importa tu interceptor
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor]) // Aquí es donde ocurre la magia
    )
  ]
};