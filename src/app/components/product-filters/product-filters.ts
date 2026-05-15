import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MaterialeLaser, MaterialeStampa3D } from '../../models/product.model';

export interface ProductFilters {
  priceMin: number;
  priceMax: number;
  search: string;
  customizable: boolean | null;
  freeShipping: boolean;
  inStock: boolean;
  comingSoon: boolean;
  orderBy: 'name' | 'price-asc' | 'price-desc';
  
  // Filtri specifici
  hasModel?: boolean | null;
  material3D?: MaterialeStampa3D | null;
  materialLaser?: MaterialeLaser | null;
  color?: string | null;
}

@Component({
  selector: 'app-product-filters',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './product-filters.html',
  styleUrl: './product-filters.css'
})
export class ProductFiltersComponent {
  @Input() filters!: ProductFilters;
  @Input() showModelFilter: boolean = false;
  @Input() showMaterial3DFilter: boolean = false;
  @Input() showMaterialLaserFilter: string | null = null; // 'oggetti' | 'stoffa'
  @Input() showColorFilter: boolean = false;

  @Output() filtersChange = new EventEmitter<ProductFilters>();

    materials3D = ['PLA', 'PETG', 'ABS', 'Resina'];
  materialsLaserOggetti = ['legno', 'metallo', 'plastica', 'gomma'];
  materialsLaserStoffa = ['cotone', 'spugna', 'poliestere'];
  colors = ['bianco', 'nero', 'verde', 'rosso', 'blu', 'giallo'];

  onFilterChange() {
    this.filtersChange.emit(this.filters);
  }

  resetFilters() {
    this.filters = {
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
    this.onFilterChange();
  }
}
