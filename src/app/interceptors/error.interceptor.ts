import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Si è verificato un errore';

      if (error.error instanceof ErrorEvent) {
        // Errore client-side
        errorMessage = `Errore: ${error.error.message}`;
      } else {
        // Errore server-side
        switch (error.status) {
          case 401:
            errorMessage = 'Non autorizzato. Effettua il login.';
            // Redirect al login
            router.navigate(['/login']);
            break;
          case 403:
            errorMessage = 'Accesso negato.';
            break;
          case 404:
            errorMessage = 'Risorsa non trovata.';
            break;
          case 500:
            errorMessage = 'Errore del server.';
            break;
          default:
            errorMessage = error.error?.message || `Errore: ${error.status}`;
        }
      }

      console.error('HTTP Error:', errorMessage, error);
      
      // Potresti mostrare un toast/snackbar qui
      // this.snackBar.open(errorMessage, 'Chiudi', { duration: 5000 });

      return throwError(() => new Error(errorMessage));
    })
  );
};
