import { RegisterDialogComponent } from './../pages/auth/register/register-dialog.component';
import { LoginDialogComponent } from './../pages/auth/login/login-dialog.component';
import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthDialogService {
  private dialog = inject(MatDialog);
  private router = inject(Router);

  /**
   * Apre il dialog di login
   * @param returnUrl URL a cui tornare dopo login (opzionale)
   */
  openLogin(returnUrl?: string): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '400px',
      maxWidth: '90vw',
      disableClose: false,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        // Login effettuato con successo
        const url = returnUrl || this.getReturnUrl() || '/';
        this.router.navigate([url]);
      } else if (result?.openRegister) {
        // Apri dialog registrazione
        this.openRegister(returnUrl);
      }
    });
  }

  /**
   * Apre il dialog di registrazione
   * @param returnUrl URL a cui tornare dopo registrazione (opzionale)
   */
  openRegister(returnUrl?: string): void {
    const dialogRef = this.dialog.open(RegisterDialogComponent, {
      width: '450px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      disableClose: false,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        // Registrazione completata con successo (auto-login già fatto)
        const url = returnUrl || this.getReturnUrl() || '/';
        this.router.navigate([url]);
      } else if (result?.openLogin) {
        // Apri dialog login
        this.openLogin(returnUrl);
      }
    });
  }

  /**
   * Ottiene il returnUrl dai query params
   */
  private getReturnUrl(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('returnUrl');
  }
}