import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-dialog">
      <h2 mat-dialog-title>
        <mat-icon>login</mat-icon>
        Accedi
      </h2>

      <mat-dialog-content>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input 
              matInput 
              type="email" 
              formControlName="email"
              placeholder="tua@email.com"
              autocomplete="email">
            <mat-icon matPrefix>email</mat-icon>
            @if (loginForm.get('email')?.hasError('required') && loginForm.get('email')?.touched) {
              <mat-error>Email obbligatoria</mat-error>
            }
            @if (loginForm.get('email')?.hasError('email') && loginForm.get('email')?.touched) {
              <mat-error>Email non valida</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input 
              matInput 
              [type]="hidePassword ? 'password' : 'text'" 
              formControlName="password"
              placeholder="••••••••"
              autocomplete="current-password">
            <mat-icon matPrefix>lock</mat-icon>
            <button 
              mat-icon-button 
              matSuffix 
              type="button"
              (click)="hidePassword = !hidePassword">
              <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            @if (loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched) {
              <mat-error>Password obbligatoria</mat-error>
            }
          </mat-form-field>

          @if (errorMessage) {
            <div class="error-message">
              <mat-icon>error</mat-icon>
              <span>{{ errorMessage }}</span>
            </div>
          }

          <div class="actions">
            <button 
              mat-raised-button 
              color="primary" 
              type="submit"
              [disabled]="!loginForm.valid || loading"
              class="full-width">
              @if (loading) {
                <mat-spinner diameter="20"></mat-spinner>
                <span>Accesso in corso...</span>
              } @else {
                <span>Accedi</span>
              }
            </button>
          </div>
        </form>

        <div class="register-link">
          <p>Non hai un account?</p>
          <button 
            mat-button 
            color="accent" 
            (click)="openRegister()">
            Registrati ora
          </button>
        </div>

        <div class="test-credentials">
          <p><strong>Credenziali di test:</strong></p>
          <p><small>Email: <code>user@test.it</code></small></p>
          <p><small>Password: <code>admin123</code></small></p>
        </div>
      </mat-dialog-content>
    </div>
  `,
  styles: [`
    .login-dialog {
      width: 400px;
      max-width: 90vw;
    }

    h2 {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0;
      padding: 20px 24px;
      border-bottom: 1px solid #e0e0e0;
    }

    mat-dialog-content {
      padding: 24px;
      min-height: 300px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background: #ffebee;
      color: #c62828;
      border-radius: 4px;
      margin-bottom: 16px;

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    }

    .actions {
      margin-top: 24px;

      button {
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      mat-spinner {
        display: inline-block;
      }
    }

    .register-link {
      text-align: center;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e0e0e0;

      p {
        margin: 0 0 8px 0;
        color: #666;
      }
    }

    .test-credentials {
      margin-top: 16px;
      padding: 12px;
      background: #f5f5f5;
      border-radius: 4px;
      font-size: 12px;

      p {
        margin: 4px 0;
      }

      code {
        background: #e0e0e0;
        padding: 2px 6px;
        border-radius: 3px;
        font-family: 'Courier New', monospace;
      }
    }
  `]
})
export class LoginDialogComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private dialogRef = inject(MatDialogRef<LoginDialogComponent>);
  private snackBar = inject(MatSnackBar);

  loginForm: FormGroup;
  loading = false;
  errorMessage = '';
  hidePassword = true;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Login effettuato con successo!', 'Chiudi', {
              duration: 3000
            });
            
            this.dialogRef.close({ success: true });
          }
        },
        error: (error) => {
          this.errorMessage = error.message || 'Credenziali non valide';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  openRegister() {
    this.dialogRef.close({ openRegister: true });
  }
}