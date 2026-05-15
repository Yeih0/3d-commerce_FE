import { email } from "@angular/forms/signals";

export enum OrderStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

export interface Order {
    id: number;
    //items: CartItem[];
    totalAmount: number;
    shippingCost: number;
    status: OrderStatus;
/*    customerInfo {
        name: string;
        email: string;
        phone: string;
        address: string;
    };*/
    createdAt: Date;
    updatedAt: Date;
}
