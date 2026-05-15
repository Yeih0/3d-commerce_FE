import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { Product } from '../../models/product.model';
import { ProductDetailDialogComponent } from '../product-dialog/product-detail-dialog.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() compact: boolean = false;
  @Output() addToCart = new EventEmitter<Product>();

  private dialog = inject(MatDialog);

  openProductDetail() {
    const dialogRef = this.dialog.open(ProductDetailDialogComponent, {
      data: { product: this.product },
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      panelClass: 'product-detail-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Il prodotto è stato aggiunto al carrello dal dialog
      }
    });
  }

  onQuickAdd(event: Event) {
    event.stopPropagation();
    this.addToCart.emit(this.product);
  }
}