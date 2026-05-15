import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthDialogService } from '../services/auth-dialog.service';

/**
 * Guard per proteggere route che richiedono autenticazione
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const authDialogService = inject(AuthDialogService);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Apri dialog login invece di fare redirect
  authDialogService.openLogin(state.url);
  
  return false;
};

/**
 * Guard per proteggere route admin
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const authDialogService = inject(AuthDialogService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }

  // Se non autenticato, apri login
  if (!authService.isAuthenticated()) {
    authDialogService.openLogin(state.url);
    return false;
  }

  // Se autenticato ma non admin, vai alla home
  router.navigate(['/']);
  return false;
};