export interface OrderDTO {
  id?: number;
  userId?: number;
  status: OrderStatus;
  totalAmount: number;
  shippingCost: number;
  
  // Customer Info
  customerName: string;
  customerSurname: string;
  customerEmail: string;
  customerPhone?: string;
  customerBirthDate?: string;
  
  // Shipping Address
  shippingAddress: string;
  shippingCity: string;
  shippingCap: string;
  
  notes?: string;
  paymentMethod?: string;
  
  items: OrderItemDTO[];
  
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderItemDTO {
  id?: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedMaterial?: string;
  selectedColor?: string;
  customizationDetails?: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

// Checkout Request
export interface CheckoutRequest {
  items: CheckoutItemRequest[];
  customerName: string;
  customerSurname: string;
  customerEmail: string;
  customerPhone?: string;
  customerBirthDate?: string;
  shippingAddress: string;
  shippingCity: string;
  shippingCap: string;
  notes?: string;
  paymentMethod: string;
}

export interface CheckoutItemRequest {
  productId: number;
  quantity: number;
  selectedMaterial?: string;
  selectedColor?: string;
  customizationDetails?: string;
}

// Update Order Status Request
export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}
