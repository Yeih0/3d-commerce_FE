import { inject, Injectable, signal } from '@angular/core';
import { Order, OrderStatus } from '../models/order.model';
import { OrderApiService } from './order-api.service';
import { OrderDTO } from '../models/order-api.model';
import { response } from 'express';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private orderApiService = inject(OrderApiService);
  private ordersSignal = signal<OrderDTO[]>([]);
  orders = this.ordersSignal.asReadonly();

  constructor() {
    this.loadOrders();
   }

   loadOrders(): void {
    this.orderApiService.getAllOrders().subscribe({
      next: (response) => {
        if (response.success) {
          this.ordersSignal.set(response.data);
        }
      },
      error: (error) => {
        console.error('Errore caricamento ordini:', error);
      }
    });
  }

  getAllOrders(): OrderDTO[] {
    return this.ordersSignal();
  }

  getOrderById(id: number): OrderDTO | undefined {
    return this.ordersSignal().find(o => o.id === id);
  }

  updateOrderStatus(id: number, status: OrderStatus): void {
    this.orderApiService.updateOrderStatus(id, {status}).subscribe({
      next: (response) => {
        if(response.success) {
          const currentOrders = this.ordersSignal();
          const index = currentOrders.findIndex(o => o.id === id);
          if(index !== -1) {
            currentOrders[index] = response.data;
            this.ordersSignal.set([...currentOrders]);
          }
        }
      },
      error: (error) => {
        console.error("Errore aggiornamento status ordine", error);
      } 
    })
  }
}
