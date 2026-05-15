import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ProductCardComponent } from '../../components/product-card/product-card';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { Product, ProductCategory } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatIconModule, 
    MatCardModule,
    ProductCardComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private router = inject(Router);

  products = this.productService.products;
  loading = this.productService.loading;

  ngOnInit() {
    this.productService.loadProducts();
  }

  get featuredProducts(){
    return this.productService.getFeaturedProducts();
  }

  get bestSellers() {
    return this.productService.getBestSeller();
  }

    get stampa3dProducts(): Product[] {
    return this.productService
      .getProductByCategory(ProductCategory.STAMPA_3D)
      .slice(0, 6); // Primi 6 prodotti
  }

  get laserProducts(): Product[] {
    return this.productService
      .getProductByCategory(ProductCategory.STAMPA_LASER)
      .slice(0, 6);
  }

  get adesiviFeatured(): Product[] {
    return this.productService
      .getProductByCategory(ProductCategory.ADESIVI)
      .slice(0, 6);
  }

  onAddToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
