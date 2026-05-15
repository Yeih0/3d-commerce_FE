import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-contatti',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  templateUrl: './contatti.html',
  styleUrl: './contatti.css'
})
export class ContattiComponent {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  contactForm: FormGroup;

  motivoOptions = [
    'Informazioni Prodotti',
    'Supporto Ordine',
    'Personalizzazioni',
    'Collaborazioni',
    'Reclami',
    'Altro'
  ];

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      motivo: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Form Data:', this.contactForm.value);
      
      this.snackBar.open('Messaggio inviato con successo! Ti risponderemo presto.', 'Chiudi', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
      
      this.contactForm.reset();
    } else {
      this.snackBar.open('Per favore compila tutti i campi obbligatori', 'Chiudi', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }
}
