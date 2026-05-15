import { Component, OnInit, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ProductCardComponent } from '../../components/product-card/product-card';
import { ProductFiltersComponent } from '../../components/product-filters/product-filters';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { Product, ProductCategory } from '../../models/product.model';
import { ProductFilters } from '../../components/product-filters/product-filters';

@Component({
  selector: 'app-adesivi',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    ProductCardComponent,
    ProductFiltersComponent
  ],
  templateUrl: './adesivi.html',
  styleUrl: './adesivi.css'
})
export class AdesiviComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);

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

  pageSize = 24;
  pageIndex = 0;
  totalProducts = 0;

  constructor() {
    effect(() => {
      const products = this.productService.products();
      if (products.length > 0) {
        this.loadProducts();
      }
    });
  }

  ngOnInit() {
    if (this.productService.products().length > 0) {
      this.loadProducts();
    }
  }

  loadProducts() {
    this.allProducts = this.productService.getProductByCategory(ProductCategory.ADESIVI);
    this.applyFilters();
  }

  applyFilters() {
    this.filteredProducts = this.productService.filterProducts(this.allProducts, this.filters);
    this.filteredProducts = this.productService.sortProducts(this.filteredProducts, this.filters.orderBy);
    this.totalProducts = this.filteredProducts.length;
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
    this.paginatedProducts = this.filteredProducts.slice(startIndex, startIndex + this.pageSize);
  }

  onAddToCart(product: Product) {
    this.cartService.addToCart(product);
  }
}