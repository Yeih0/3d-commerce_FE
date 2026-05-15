import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment.development';
import { 
  ApiResponse, 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest,
  ChangePasswordRequest,
  UserDTO
} from '../models/api.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  private apiUrl = environment.apiUrl;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  // State management
  private currentUserSubject = new BehaviorSubject<UserDTO | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  /**
   * Login utente
   */
  login(credentials: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${this.apiUrl}/auth/login`, 
      credentials
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.saveAuthData(response.data);
        }
      })
    );
  }

  /**
   * Registrazione nuovo utente
   */
  register(data: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${this.apiUrl}/auth/register`, 
      data
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.saveAuthData(response.data);
        }
      })
    );
  }

  /**
   * Logout
   */
  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  /**
   * Cambio password
   */
  changePassword(data: ChangePasswordRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(
      `${this.apiUrl}/user/change-password`,
      data
    );
  }

  /**
   * Get profilo utente corrente
   */
  getCurrentUserProfile(): Observable<ApiResponse<UserDTO>> {
    return this.http.get<ApiResponse<UserDTO>>(
      `${this.apiUrl}/user/profile`
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.saveUser(response.data);
        }
      })
    );
  }

  /**
   * Salva token e dati utente
   */
  private saveAuthData(authResponse: AuthResponse): void {
    if (!isPlatformBrowser(this.platformId)) return;

    localStorage.setItem(this.TOKEN_KEY, authResponse.token);
    
    const user: UserDTO = {
      id: authResponse.userId,
      email: authResponse.email,
      name: authResponse.name,
      role: authResponse.role as 'USER' | 'ADMIN',
      isActive: true,
      createdAt: new Date()
    };

    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * Salva user aggiornato
   */
  private saveUser(user: UserDTO): void {
    if (!isPlatformBrowser(this.platformId)) return;

    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  /**
   * Carica utente da localStorage
   */
  private loadUserFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const token = localStorage.getItem(this.TOKEN_KEY);
    const userJson = localStorage.getItem(this.USER_KEY);

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as UserDTO;
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (e) {
        this.clearAuthData();
      }
    }
  }

  /**
   * Rimuove tutti i dati auth
   */
  private clearAuthData(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Get token JWT
   */
  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Check se utente è autenticato
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Get current user
   */
  getCurrentUser(): UserDTO | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check se utente è admin
   */
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'ADMIN';
  }
}
