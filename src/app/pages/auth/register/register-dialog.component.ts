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
import { MatNativeDateModule, MAT_DATE_LOCALE, MAT_DATE_FORMATS,  DateAdapter, NativeDateAdapter } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

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
  providers: [
    MatDatepickerModule,
    MatNativeDateModule,
    { provide: MAT_DATE_LOCALE, useValue: 'it-IT' },
    { provide: DateAdapter, useClass: NativeDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS } 
  ],
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.css']
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
    const today = new Date();
    this.maxDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );

    console.log('Data massima (18 anni fa):', this.maxDate); // DEBUG

    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', [Validators.required, this.ageValidator.bind(this)]],
      phone: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

  }

  // Validator età
  ageValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const selectedDate = control.value;

    if (!(selectedDate instanceof Date)) {
      console.error('birthDate non è un Date object:', selectedDate);
      return { invalidDate: true };
    }

    const today = new Date();
    const birthDate = new Date(selectedDate);

    console.log('=== VALIDAZIONE ETÀ ===');
    console.log('Oggi:', today.toLocaleDateString('it-IT'));
    console.log('Data nascita:', birthDate.toLocaleDateString('it-IT'));

    // check età
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // Aggiusta se non ha ancora compiuto gli anni quest'anno
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    console.log('Età calcolata:', age);

    if (age < 18) {
      console.log('❌ Età insufficiente');
      return { underAge: true };
    }

    console.log('✅ Età valida');
    return null;
  }

  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit() {
    console.log('=== SUBMIT FORM ===');
    console.log('Form valido?', this.registerForm.valid);
    console.log('Form value:', this.registerForm.value);

    if (!this.registerForm.valid) {
      console.log('❌ Form non valido!');
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control?.invalid) {
          console.log(`  ${key}:`, control.errors);
        }
      });

      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });

      return;
    }

    this.loading = true;
    this.errorMessage = '';

    // date converter us -> it
    const birthDate: Date = this.registerForm.get('birthDate')?.value;
    const year = birthDate.getFullYear();
    const month = String(birthDate.getMonth() + 1).padStart(2, '0');
    const day = String(birthDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    console.log('Data formattata per backend:', formattedDate);

    const registerData: RegisterRequest = {
      name: this.registerForm.get('name')?.value.trim(),
      surname: this.registerForm.get('surname')?.value.trim(),
      email: this.registerForm.get('email')?.value.trim().toLowerCase(),
      password: this.registerForm.get('password')?.value,
      birthDate: formattedDate,
      phone: this.registerForm.get('phone')?.value?.trim() || undefined
    };

    console.log('Dati da inviare:', registerData);

    this.authService.register(registerData).subscribe({
      next: (response) => {
        console.log('✅ Risposta backend:', response);
        if (response.success) {
          this.snackBar.open('Registrazione completata! Benvenuto!', 'Chiudi', {
            duration: 3000
          });
          this.dialogRef.close({ success: true });
        }
      },
      error: (error) => {
        console.error('❌ Errore registrazione:', error);
        this.errorMessage = error.message || 'Errore durante la registrazione';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  openLogin() {
    this.dialogRef.close({ openLogin: true });
  }
}