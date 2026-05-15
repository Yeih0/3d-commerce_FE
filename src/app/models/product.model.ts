export enum ProductCategory {
  STAMPA_3D = 'STAMPA_3D',
  STAMPA_LASER = 'STAMPA_LASER',
  ADESIVI = 'ADESIVI'
}

export enum MaterialeStampa3D {
  PLA = 'PLA',
  PETG = 'PETG',
  ABS = 'ABS',
  RESINA = 'Resina'
}

export enum MaterialeLaser {
  LEGNO = 'legno',
  METALLO = 'metallo',
  PLASTICA = 'plastica',
  GOMMA = 'gomma',
  COTONE = 'cotone',
  SPUGNA = 'spugna',
  POLIESTERE = 'poliestere'
}

export interface ProductStock {
  [materialOrColor: string]: {
    [variant: string]: number;
  };
}

export interface Customization {
  available: boolean;
  description?: string;
  estimatedTime?: number; // in giorni
  requiresPhone?: boolean;
  fontOptions?: string[];
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  images: string[];
  dimensions?: string;
  
  // Spedizione e lavorazione
  shippingCost: number;
  processingDays: number;
  shippingDays: number;
  freeShipping: boolean;
  
  // Disponibilità
  inStock: boolean;
  comingSoon: boolean;
  stock: ProductStock;
  
  // Personalizzazione
  customization: Customization;
  
  // Specifico per Stampa 3D
  hasModel?: boolean;
  modelFileUrl?: string;
  materials3D?: MaterialeStampa3D[];
  
  // Specifico per Laser
  materialsLaser?: MaterialeLaser[];
  laserType?: 'oggetti' | 'stoffa';
  
  // Specifico per Adesivi
  colors?: string[];
  
  // Tags
  tags: string[];
  featured: boolean;
  bestseller: boolean;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}