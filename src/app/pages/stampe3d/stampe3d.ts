import { ProductFilters } from './../../components/product-filters/product-filters';
import { Component, OnInit, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductCardComponent } from '../../components/product-card/product-card';
import { ProductFiltersComponent } from '../../components/product-filters/product-filters';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { Product, ProductCategory } from '../../models/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stampe3d',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    ProductCardComponent,
    ProductFiltersComponent
  ],
  templateUrl: './stampe3d.html',
  styleUrl: './stampe3d.css'
})
export class Stampe3dComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private router = inject(Router);

  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];

  filters: ProductFilters = {
    priceMin: 0,
    priceMax: 1000,
    search: '',
    customizable: null,
    freeShipping: false,
    inStock: true,
    comingSoon: false,
    orderBy: 'name',
    hasModel: null,
    material3D: null,
    materialLaser: null,
    color: null
  };

  // Pagination
  pageSize = 24;
  pageIndex = 0;
  totalProducts = 0;

  loading = false;

  constructor() {
    effect(() => {
      const products = this.productService.products();
      if (products.length > 0) {
        this.loadProducts();
      }
    })
  }

  ngOnInit() {
    if (this.productService.products().length > 0) {
      this.loadProducts();
    }
  }

  loadProducts() {
    this.loading = true;

    this.allProducts = this.productService.getProductByCategory(ProductCategory.STAMPA_3D);
    console.log('📦 Stampe 3D caricate:', this.allProducts.length)

    this.applyFilters();
    this.loading = false;
  }

  applyFilters() {
    // Applica filtri
    this.filteredProducts = this.productService.filterProducts(this.allProducts, this.filters);

    // Applica ordinamento
    this.filteredProducts = this.productService.sortProducts(this.filteredProducts, this.filters.orderBy);

    this.totalProducts = this.filteredProducts.length;

    // Reset paginazione quando cambiano i filtri
    this.pageIndex = 0;
    this.updatePaginatedProducts();
  }

  onFiltersChange(newFilters: ProductFilters) {
    this.filters = newFilters;
    this.applyFilters();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updatePaginatedProducts() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  onAddToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  goToModels() {
    this.router.navigate(['/modelli-stampa']);
  }
}