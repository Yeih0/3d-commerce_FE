import { Product } from "./product.model";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedMaterial?: string;
  selectedColor?: string;
  customizationDetails?: {
    description: string;
    phone?: string;
    font?: string;
  };
  totalPrice: number;
}