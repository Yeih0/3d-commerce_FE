import { AuthService } from './../../../services/auth.service';
import { RegisterRequest } from './../../../models/api.model';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="register-dialog">
      <h2 mat-dialog-title>
        <mat-icon>person_add</mat-icon>
        Registrati
      </h2>

      <mat-dialog-content>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          
          <!-- Nome -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nome</mat-label>
            <input 
              matInput 
              formControlName="name"
              placeholder="Mario"
              autocomplete="given-name">
            <mat-icon matPrefix>person</mat-icon>
            @if (registerForm.get('name')?.hasError('required') && registerForm.get('name')?.touched) {
              <mat-error>Nome obbligatorio</mat-error>
            }
          </mat-form-field>

          <!-- Cognome -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Cognome</mat-label>
            <input 
              matInput 
              formControlName="surname"
              placeholder="Rossi"
              autocomplete="family-name">
            <mat-icon matPrefix>person</mat-icon>
            @if (registerForm.get('surname')?.hasError('required') && registerForm.get('surname')?.touched) {
              <mat-error>Cognome obbligatorio</mat-error>
            }
          </mat-form-field>

          <!-- Email -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input 
              matInput 
              type="email"
              formControlName="email"
              placeholder="mario.rossi@email.com"
              autocomplete="email">
            <mat-icon matPrefix>email</mat-icon>
            @if (registerForm.get('email')?.hasError('required') && registerForm.get('email')?.touched) {
              <mat-error>Email obbligatoria</mat-error>
            }
            @if (registerForm.get('email')?.hasError('email') && registerForm.get('email')?.touched) {
              <mat-error>Email non valida</mat-error>
            }
          </mat-form-field>

          <!-- Data di Nascita -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Data di Nascita</mat-label>
            <input 
              matInput 
              [matDatepicker]="picker"
              formControlName="birthDate"
              placeholder="GG/MM/AAAA"
              [max]="maxDate">
            <mat-icon matPrefix>cake</mat-icon>
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            @if (registerForm.get('birthDate')?.hasError('required') && registerForm.get('birthDate')?.touched) {
              <mat-error>Data di nascita obbligatoria</mat-error>
            }
            @if (registerForm.get('birthDate')?.hasError('underAge')) {
              <mat-error>Devi avere almeno 18 anni</mat-error>
            }
          </mat-form-field>

          <!-- Telefono (opzionale) -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Telefono (opzionale)</mat-label>
            <input 
              matInput 
              type="tel"
              formControlName="phone"
              placeholder="+39 123 456 7890"
              autocomplete="tel">
            <mat-icon matPrefix>phone</mat-icon>
          </mat-form-field>

          <!-- Password -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input 
              matInput 
              [type]="hidePassword ? 'password' : 'text'"
              formControlName="password"
              placeholder="••••••••"
              autocomplete="new-password">
            <mat-icon matPrefix>lock</mat-icon>
            <button 
              mat-icon-button 
              matSuffix 
              type="button"
              (click)="hidePassword = !hidePassword">
              <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            @if (registerForm.get('password')?.hasError('required') && registerForm.get('password')?.touched) {
              <mat-error>Password obbligatoria</mat-error>
            }
            @if (registerForm.get('password')?.hasError('minlength')) {
              <mat-error>Minimo 6 caratteri</mat-error>
            }
          </mat-form-field>

          <!-- Conferma Password -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Conferma Password</mat-label>
            <input 
              matInput 
              [type]="hideConfirmPassword ? 'password' : 'text'"
              formControlName="confirmPassword"
              placeholder="••••••••"
              autocomplete="new-password">
            <mat-icon matPrefix>lock</mat-icon>
            <button 
              mat-icon-button 
              matSuffix 
              type="button"
              (click)="hideConfirmPassword = !hideConfirmPassword">
              <mat-icon>{{ hideConfirmPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            @if (registerForm.get('confirmPassword')?.hasError('required') && registerForm.get('confirmPassword')?.touched) {
              <mat-error>Conferma password obbligatoria</mat-error>
            }
            @if (registerForm.hasError('passwordMismatch') && registerForm.get('confirmPassword')?.touched) {
              <mat-error>Le password non corrispondono</mat-error>
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
              [disabled]="!registerForm.valid || loading"
              class="full-width">
              @if (loading) {
                <mat-spinner diameter="20"></mat-spinner>
                <span>Registrazione in corso...</span>
              } @else {
                <span>Registrati</span>
              }
            </button>
          </div>
        </form>

        <div class="login-link">
          <p>Hai già un account?</p>
          <button 
            mat-button 
            color="accent" 
            (click)="openLogin()">
            Accedi
          </button>
        </div>
      </mat-dialog-content>
    </div>
  `,
  styles: [`
    .register-dialog {
      width: 450px;
      max-width: 90vw;
      max-height: 90vh;
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
      max-height: calc(90vh - 140px);
      overflow-y: auto;
    }

    .full-width {
      width: 100%;
      margin-bottom: 12px;
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

    .login-link {
      text-align: center;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e0e0e0;

      p {
        margin: 0 0 8px 0;
        color: #666;
      }
    }
  `]
})
export class RegisterDialogComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private dialogRef = inject(MatDialogRef<RegisterDialogComponent>);
  private snackBar = inject(MatSnackBar);

  registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  hidePassword = true;
  hideConfirmPassword = true;
  maxDate: Date;

  constructor() {
    // Data massima: 18 anni fa
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);

    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', [Validators.required, this.ageValidator]],
      phone: [''], // Opzionale
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  // Validator per età minima 18 anni
  ageValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const birthDate = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      if (age - 1 < 18) {
        return { underAge: true };
      }
    } else {
      if (age < 18) {
        return { underAge: true };
      }
    }

    return null;
  }

  // Validator per password match
  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      // Formatta data per il backend (YYYY-MM-DD)
      const birthDate = new Date(this.registerForm.get('birthDate')?.value);
      const formattedDate = birthDate.toISOString().split('T')[0];

      const registerData: RegisterRequest = {
        name: this.registerForm.get('name')?.value,
        surname: this.registerForm.get('surname')?.value,
        email: this.registerForm.get('email')?.value,
        password: this.registerForm.get('password')?.value,
        birthDate: formattedDate,
        phone: this.registerForm.get('phone')?.value || undefined
      };

      this.authService.register(registerData).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Registrazione completata! Benvenuto!', 'Chiudi', {
              duration: 3000
            });
            
            this.dialogRef.close({ success: true });
          }
        },
        error: (error) => {
          this.errorMessage = error.message || 'Errore durante la registrazione';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  openLogin() {
    this.dialogRef.close({ openLogin: true });
  }
}