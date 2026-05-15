import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCategory } from '../../models/product.model';

@Component({
  selector: 'app-product-image',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (imageUrl) {
      <img [src]="imageUrl" [alt]="altText" class="product-img">
    } @else {
      <div class="svg-placeholder" [innerHTML]="getPlaceholderSVG()"></div>
    }
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    .product-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .svg-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .svg-placeholder svg {
      width: 60%;
      height: 60%;
    }
  `]
})
export class ProductImageComponent {
  @Input() imageUrl?: string;
  @Input() category?: ProductCategory;
  @Input() altText: string = 'Product';

  getPlaceholderSVG(): string {
    // Genera SVG basato sulla categoria
    const color = this.getCategoryColor();
    return `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="${color}10"/>
        <circle cx="50" cy="50" r="30" fill="${color}" opacity="0.3"/>
        <circle cx="50" cy="50" r="20" fill="${color}"/>
      </svg>
    `;
  }

  private getCategoryColor(): string {
    switch(this.category) {
      case ProductCategory.STAMPA_3D: return '#22c55e';
      case ProductCategory.STAMPA_LASER: return '#f59e0b';
      case ProductCategory.ADESIVI: return '#3b82f6';
      default: return '#6b7280';
    }
  }
}