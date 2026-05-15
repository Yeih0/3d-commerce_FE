import { Injectable, signal, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { ProductApiService } from './product-api.service';
import { ProductDTO } from '../models/product-api.model';
import { Product, ProductCategory } from '../models/product.model';
import { ProductFilters } from '../components/product-filters/product-filters';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productApiService = inject(ProductApiService);

  // Cache locale per i prodotti
  private productSignal = signal<Product[]>([]);
  products = this.productSignal.asReadonly();

  private loadingSignal = signal<boolean>(false);
  loading = this.loadingSignal.asReadonly();

  constructor() {
    this.loadProducts();
  }

  /**
   * Carica tutti i prodotti dal backend
   */
  loadProducts(): void {
    this.loadingSignal.set(true);
    this.productApiService.getAllProducts().subscribe({
      next: (response) => {
        if (response.success) {
          const products = response.data.map(dto => this.convertDTOToProduct(dto));
          this.productSignal.set(products);
        }
        this.loadingSignal.set(false);
      },
      error: (error) => {
        console.error('Errore caricamento prodotti:', error);
        this.loadingSignal.set(false);
      }
    });
  }

  /**convertDTOToProduct
   * Get tutti i prodotti (dalla cache)
   */
  getAllProducts(): Product[] {
    return this.productSignal();
  }

  /**
   * Get prodotto per ID (chiama backend)
   */
  getProductById(id: number): Observable<Product | undefined> {
    return this.productApiService.getProductById(id).pipe(
      map(response => {
        if (response.success) {
          return this.convertDTOToProduct(response.data);
        }
        return undefined;
      })
    );
  }

  /**
   * Get prodotti per categoria
   */
  getProductByCategory(category: ProductCategory): Product[] {
    return this.productSignal().filter(p => p.category === category);
  }

  /**
   * Get prodotti featured
   */
  getFeaturedProducts(): Product[] {
    return this.productSignal().filter(p => p.featured);
  }

  /**
   * Get bestsellers
   */
  getBestSeller(): Product[] {
    return this.productSignal().filter(p => p.bestseller);
  }

  /**
   * Cerca prodotti (chiama backend)
   */
  searchProducts(query: string): Observable<Product[]> {
    return this.productApiService.searchProducts(query).pipe(
      map(response => {
        if (response.success) {
          return response.data.map(dto => this.convertDTOToProduct(dto));
        }
        return [];
      })
    );
  }

  /**
   * Filtra prodotti localmente
   */
  filterProducts(products: Product[], filters: ProductFilters): Product[] {
    return products.filter(product => {
      // price
      if (product.price < filters.priceMin || product.price > filters.priceMax) {
        return false;
      }

      // search
      if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // customizable
      if (filters.customizable !== null && product.customization.available !== filters.customizable) {
        return false;
      }

      // free shipping
      if (filters.freeShipping && !product.freeShipping) {
        return false;
      }

      // available
      if (filters.inStock && !product.inStock) {
        return false;
      }

      // comingSoon
      if (filters.comingSoon && !product.comingSoon) {
        return false;
      }

      // 3D model
      if (filters.hasModel !== null && filters.hasModel !== undefined) {
        if (product.hasModel !== filters.hasModel) {
          return false;
        }
      }

      // 3d material type
      if (filters.material3D && product.materials3D) {
        if (!product.materials3D.includes(filters.material3D)) {
          return false;
        }
      }

      // laser material type
      if (filters.materialLaser && product.materialsLaser) {
        if (!product.materialsLaser.includes(filters.materialLaser)) {
          return false;
        }
      }

      // color
      if (filters.color && product.colors) {
        if (!product.colors.includes(filters.color)) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Ordina prodotti
   */
  sortProducts(products: Product[], orderBy: string): Product[] {
    const sorted = [...products];

    switch (orderBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      default:
        return sorted;
    }
  }

  // ========== ADMIN METHODS ==========

  /**
   * Aggiungi prodotto (ADMIN)
   */
  addProduct(productDTO: ProductDTO): Observable<Product> {
    return this.productApiService.createProduct(productDTO).pipe(
      map(response => {
        if (response.success) {
          const product = this.convertDTOToProduct(response.data);
          const currentProducts = this.productSignal();
          this.productSignal.set([...currentProducts, product]);
          return product;
        }
        throw new Error('Errore creazione prodotto');
      })
    );
  }

  /**
   * Aggiorna prodotto (ADMIN)
   */
  updateProduct(id: number, productDTO: ProductDTO): Observable<Product> {
    return this.productApiService.updateProduct(id, productDTO).pipe(
      tap(response => {
        if (response.success) {
          const product = this.convertDTOToProduct(response.data);
          const currentProducts = this.productSignal();
          const index = currentProducts.findIndex(p => p.id === id);
          if (index !== -1) {
            currentProducts[index] = product;
            this.productSignal.set([...currentProducts]);
          }
        }
      }),
      map(response => this.convertDTOToProduct(response.data))
    );
  }

  /**
   * Elimina prodotto (ADMIN)
   */
  deleteProduct(id: number): Observable<void> {
    return this.productApiService.deleteProduct(id).pipe(
      tap(() => {
        const currentProducts = this.productSignal();
        this.productSignal.set(currentProducts.filter(p => p.id !== id));
      }),
      map(() => undefined)
    );
  }

  /**
   * Converti ProductDTO in Product (per compatibilità con UI esistente)
   */
  private convertDTOToProduct(dto: ProductDTO): Product {
    return {
      id: dto.id!,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      category: this.mapCategory(dto.category), // ✅ Mappa correttamente la categoria
      images: dto.images && dto.images.length > 0
        ? dto.images.map(img => img.imageUrl)
        : ['assets/images/placeholder.jpg'],
      dimensions: dto.dimensions || '',
      shippingCost: dto.shippingCost,
      processingDays: dto.processingDays,
      shippingDays: dto.shippingDays,
      freeShipping: dto.freeShipping,
      inStock: dto.inStock,
      comingSoon: dto.comingSoon,
      stock: this.convertStockFormat(dto.stock),
      customization: {
        available: dto.customizable,
        description: '',
        estimatedTime: 0
      },
      hasModel: dto.hasModel,
      modelFileUrl: dto.modelFileUrl,
      tags: [dto.category],
      featured: dto.featured,
      bestseller: dto.bestseller,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : new Date(),
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : new Date()
    } as Product;
  }

  private mapCategory(category: string): ProductCategory {
  switch(category) {
    case 'STAMPA_3D': return ProductCategory.STAMPA_3D;
    case 'STAMPA_LASER': return ProductCategory.STAMPA_LASER;
    case 'ADESIVI': return ProductCategory.ADESIVI;
    default: return ProductCategory.STAMPA_3D;
  }
}

// materiali 3D dallo stock
private extractMaterials3D(stock: any[]): any[] {
  if (!stock || stock.length === 0) return [];
  const materials = [...new Set(stock.map(s => s.material))];
  return materials.filter(m => ['PLA', 'PETG', 'ABS', 'Resina'].includes(m));
}

// materiali Laser dallo stock
private extractMaterialsLaser(stock: any[]): any[] {
  if (!stock || stock.length === 0) return [];
  const materials = [...new Set(stock.map(s => s.material))];
  return materials.filter(m => ['legno', 'metallo', 'cotone', 'spugna'].includes(m));
}

// colori disponibili
private extractColors(stock: any[]): string[] {
  if (!stock || stock.length === 0) return [];
  return [...new Set(stock.map(s => s.color))];
}

  /**
   * Converti formato stock
   */
  private convertStockFormat(stockDTO: any[]): any {
    const stock: any = {};

    stockDTO.forEach(item => {
      if (!stock[item.material]) {
        stock[item.material] = {};
      }
      stock[item.material][item.color] = item.quantity;
    });

    return stock;
  }

  /**
   * Get icona categoria
   */
  getProductIcon(category: ProductCategory): string {
    const icons = {
      [ProductCategory.STAMPA_3D]: `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="80" height="80" fill="#22c55e" opacity="0.2"/>
          <path d="M50 20 L80 50 L50 80 L20 50 Z" fill="#22c55e"/>
          <circle cx="50" cy="50" r="15" fill="white"/>
        </svg>
      `,
      [ProductCategory.STAMPA_LASER]: `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="20" width="60" height="60" fill="#f59e0b" opacity="0.2"/>
          <path d="M30 30 L70 30 L70 70 L30 70 Z" stroke="#f59e0b" stroke-width="3" fill="none"/>
          <line x1="30" y1="50" x2="70" y2="50" stroke="#f59e0b" stroke-width="2"/>
        </svg>
      `,
      [ProductCategory.ADESIVI]: `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect x="15" y="15" width="70" height="70" rx="10" fill="#3b82f6" opacity="0.2"/>
          <rect x="25" y="25" width="50" height="50" rx="8" fill="#3b82f6"/>
          <circle cx="50" cy="50" r="20" fill="white"/>
        </svg>
      `
    };
    return icons[category];
  }
}
