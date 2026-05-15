import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-product-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './product-detail-dialog.component.html',
  styleUrl: './product-detail-dialog.component.css'
})
export class ProductDetailDialogComponent {
  private fb = inject(FormBuilder);
  private cartService = inject(CartService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<ProductDetailDialogComponent>);

  product: Product;
  productForm: FormGroup;
  
  availableMaterials: string[] = [];
  availableColors: string[] = [];
  selectedMaterial: string = '';
  selectedColor: string = '';
  stockAvailable: number = 0;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { product: Product }) {
    this.product = data.product;
    
    this.productForm = this.fb.group({
      material: [''],
      color: [''],
      quantity: [1, [Validators.required, Validators.min(1)]],
      customization: [false],
      customizationDescription: [''],
      customizationFont: [''],
      customerPhone: ['']
    });

    this.initializeOptions();
    this.setupFormListeners();
  }

  initializeOptions() {
    // Inizializza materiali disponibili
    if (this.product.materials3D && this.product.materials3D.length > 0) {
      this.availableMaterials = this.product.materials3D;
    } else if (this.product.materialsLaser && this.product.materialsLaser.length > 0) {
      this.availableMaterials = this.product.materialsLaser;
    } else if (this.product.stock) {
      this.availableMaterials = Object.keys(this.product.stock);
    }

    // Seleziona primo materiale se disponibile
    if (this.availableMaterials.length > 0) {
      this.productForm.patchValue({ material: this.availableMaterials[0] });
      this.onMaterialChange(this.availableMaterials[0]);
    }
  }

  setupFormListeners() {
    // Listener per materiale
    this.productForm.get('material')?.valueChanges.subscribe(material => {
      if (material) {
        this.onMaterialChange(material);
      }
    });

    // Listener per colore
    this.productForm.get('color')?.valueChanges.subscribe(color => {
      if (color) {
        this.onColorChange(color);
      }
    });

    // Listener per personalizzazione
    this.productForm.get('customization')?.valueChanges.subscribe(custom => {
      if (custom) {
        this.productForm.get('customizationDescription')?.setValidators([Validators.required]);
        if (this.product.customization.requiresPhone) {
          this.productForm.get('customerPhone')?.setValidators([Validators.required]);
        }
      } else {
        this.productForm.get('customizationDescription')?.clearValidators();
        this.productForm.get('customerPhone')?.clearValidators();
      }
      this.productForm.get('customizationDescription')?.updateValueAndValidity();
      this.productForm.get('customerPhone')?.updateValueAndValidity();
    });
  }

  onMaterialChange(material: string) {
    this.selectedMaterial = material;
    
    // Aggiorna colori disponibili in base al materiale
    if (this.product.stock && this.product.stock[material]) {
      this.availableColors = Object.keys(this.product.stock[material]);
      if (this.availableColors.length > 0) {
        this.productForm.patchValue({ color: this.availableColors[0] });
        this.onColorChange(this.availableColors[0]);
      }
    } else if (this.product.colors) {
      this.availableColors = this.product.colors;
      if (this.availableColors.length > 0) {
        this.productForm.patchValue({ color: this.availableColors[0] });
      }
    }
  }

  onColorChange(color: string) {
    this.selectedColor = color;
    this.updateStockAvailable();
  }

  updateStockAvailable() {
    if (this.product.stock && this.selectedMaterial && this.selectedColor) {
      this.stockAvailable = this.product.stock[this.selectedMaterial]?.[this.selectedColor] || 0;
    } else {
      this.stockAvailable = 0;
    }
  }

  getTotalPrice(): number {
    const quantity = this.productForm.get('quantity')?.value || 1;
    return this.product.price * quantity;
  }

  onAddToCart() {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      
      const customizationDetails = formValue.customization ? {
        description: formValue.customizationDescription,
        font: formValue.customizationFont,
        phone: formValue.customerPhone
      } : undefined;

      this.cartService.addToCart(
        this.product,
        formValue.quantity,
        formValue.material,
        formValue.color,
        customizationDetails
      );

      this.snackBar.open('Prodotto aggiunto al carrello!', 'Chiudi', {
        duration: 3000
      });

      this.dialogRef.close(true);
    } else {
      this.snackBar.open('Per favore completa tutti i campi obbligatori', 'Chiudi', {
        duration: 3000
      });
    }
  }

  close() {
    this.dialogRef.close(false);
  }
}