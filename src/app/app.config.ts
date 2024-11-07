
import { provideRouter, withHashLocation } from '@angular/router';
import { ApplicationConfig, importProvidersFrom, NgModule } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { authInterceptor } from './shared/interceptor/auth.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
  provideHttpClient(),
  provideClientHydration(),
  provideHttpClient(
    withFetch(),
    withInterceptors([authInterceptor]),
    // ChartPieComponent(),
    // ColorDetailsModalComponent()
  ),
  provideAnimations(),
  provideAnimationsAsync(),
  importProvidersFrom(NgModule), provideAnimationsAsync(),
  // provideRouter(routes, withHashLocation()),
  ]
};
