import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { routes } from './app.routes';
import { HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';

// Import interceptors
import { authInterceptor } from './interceptors/auth.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';

import localeIt from '@angular/common/locales/it'; 
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeIt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        errorInterceptor
      ])
    ),
    { provide: LOCALE_ID, useValue: 'it-IT' }
  ]
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'E-Commerce 3D Printing';
}
