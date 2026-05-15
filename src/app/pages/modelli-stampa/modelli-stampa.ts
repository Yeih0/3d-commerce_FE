import { Component, OnInit, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductService } from '../../services/product';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-modelli-stampa',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  templateUrl: './modelli-stampa.html',
  styleUrl: './modelli-stampa.css'
})
export class ModelliStampaComponent implements OnInit {
  private productService = inject(ProductService);
  private snackBar = inject(MatSnackBar);

  modelsAvailable: Product[] = [];

  constructor() {
    effect(() => {
      const products = this.productService.products();
      if (products.length > 0) {
        this.loadModels();
      }
    });
  }

  ngOnInit() {
    if (this.productService.products().length > 0) {
      this.loadModels();
    }
  }

  loadModels() {
    // Carica solo prodotti con modello disponibile
    this.modelsAvailable = this.productService
      .getAllProducts()
      .filter(p => p.hasModel && p.modelFileUrl);
  }

  downloadModel(product: Product) {
    this.snackBar.open(`Download di ${product.name} avviato!`, 'Chiudi', {
      duration: 3000
    });
    // Qui implementeresti il vero download del file
  }
}