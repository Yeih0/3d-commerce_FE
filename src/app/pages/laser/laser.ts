import { Component, OnInit, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
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
  selector: 'app-laser',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    ProductCardComponent,
    ProductFiltersComponent
  ],
  templateUrl: './laser.html',
  styleUrl: './laser.css'
})
export class LaserComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);

  laserType: 'oggetti' | 'stoffa' = 'oggetti';
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
    // Determina il tipo di laser dalla route
    this.route.data.subscribe(data => {
      this.laserType = data['type'] || 'oggetti';
      if (this.productService.products().length > 0) {
        this.loadProducts();
      }
    });
  }

  loadProducts() {
    const allLaserProducts = this.productService.getProductByCategory(ProductCategory.STAMPA_LASER);

    console.log('🔦 Prodotti laser totali:', allLaserProducts.length);

    // Filtra per tipo (oggetti o stoffa)
    this.allProducts = allLaserProducts;

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

  get pageTitle(): string {
    return this.laserType === 'oggetti' ? 'Laser su Oggetti' : 'Laser su Stoffa';
  }

  get pageSubtitle(): string {
    return this.laserType === 'oggetti'
      ? 'Incisioni laser su legno, metallo, plastica e gomma'
      : 'Personalizza tessuti, magliette, asciugamani e panni';
  }
}