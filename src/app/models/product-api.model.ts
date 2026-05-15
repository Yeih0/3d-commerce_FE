export interface ProductDTO {
  id?: number;
  name: string;
  description: string;
  price: number;
  category: 'STAMPA_3D' | 'STAMPA_LASER' | 'ADESIVI';
  dimensions?: string;
  processingDays: number;
  shippingDays: number;
  shippingCost: number;
  freeShipping: boolean;
  inStock: boolean;
  comingSoon: boolean;
  customizable: boolean;
  hasModel: boolean;
  modelFileUrl?: string;
  featured: boolean;
  bestseller: boolean;
  images: ProductImageDTO[];
  stock: ProductStockDTO[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductImageDTO {
  id?: number;
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface ProductStockDTO {
  id?: number;
  material: string;
  color: string;
  quantity: number;
}

export enum ProductCategory {
  STAMPA_3D = 'STAMPA_3D',
  STAMPA_LASER = 'STAMPA_LASER',
  ADESIVI = 'ADESIVI'
}
