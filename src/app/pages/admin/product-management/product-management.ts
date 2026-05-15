import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { ProductService } from '../../../services/product';
import { Product, ProductCategory } from '../../../models/product.model';
import { ProductDTO } from '../../../models/product-api.model';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatChipsModule,
    MatCardModule
  ],
  templateUrl: './product-management.html',
  styleUrl: './product-management.css'
})
export class ProductManagementComponent implements OnInit {
  private productService = inject(ProductService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  products: Product[] = [];
  displayedColumns = ['id', 'name', 'category', 'price', 'inStock', 'actions'];

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.products = this.productService.getAllProducts();
  }

  addProduct() {
    this.snackBar.open('Funzionalità in sviluppo: Form aggiungi prodotto', 'Chiudi', {
      duration: 3000
    });
  }

  editProduct(product: Product) {
    this.snackBar.open(`Modifica prodotto: ${product.name}`, 'Chiudi', {
      duration: 2000
    });
  }

  deleteProduct(id: number) {
    if (confirm('Sei sicuro di voler eliminare questo prodotto?')) {
      this.productService.deleteProduct(id);
      this.loadProducts();
      this.snackBar.open('Prodotto eliminato', 'Chiudi', {
        duration: 2000
      });
    }
  }

  toggleStock(product: Product) {
    const productDTO = this.convertProductToDTO(product);
    productDTO.inStock = !product.inStock;

    this.productService.updateProduct(product.id, productDTO).subscribe({
      next: (updatedProduct) => {
        console.log('Prodotto aggiornato:', updatedProduct);
        this.loadProducts();
        this.snackBar.open('Disponibilità aggiornata', 'Chiudi', {
          duration: 2000
        });
      },
      error: (error) => {
        console.error('Errore aggiornamento prodotto:', error);
      }
    });
  }

  private convertProductToDTO(product: Product): ProductDTO {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category as any,
      dimensions: product.dimensions,
      processingDays: product.processingDays,
      shippingDays: product.shippingDays,
      shippingCost: product.shippingCost,
      freeShipping: product.freeShipping,
      inStock: product.inStock,
      comingSoon: product.comingSoon,
      customizable: product.customization?.available || false,
      hasModel: product.hasModel as any,
      modelFileUrl: product.modelFileUrl,
      featured: product.featured,
      bestseller: product.bestseller,
      images: product.images.map((url, index) => ({
        imageUrl: url,
        isPrimary: index === 0,
        displayOrder: index
      })),
      stock: this.convertStockToDTO(product.stock),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    };
  }

  private convertStockToDTO(stock: any): any[] {
    const stockArray: any[] = [];

    if (stock) {
      Object.keys(stock).forEach(material => {
        Object.keys(stock[material]).forEach(color => {
          stockArray.push({
            material,
            color,
            quantity: stock[material][color]
          });
        });
      });
    }

    return stockArray;
  }
}