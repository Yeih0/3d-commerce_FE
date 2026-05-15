import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminService } from '../../../services/admin';
import { Order, OrderStatus } from '../../../models/order.model';
import { OrderDTO } from '../../../models/order-api.model';

@Component({
  selector: 'app-orders-history',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './orders-history.html',
  styleUrl: './orders-history.css'
})
export class OrdersHistoryComponent implements OnInit {
  private adminService = inject(AdminService);
  private snackBar = inject(MatSnackBar);

  orders: OrderDTO[] = [];
  displayedColumns = ['id', 'customer', 'items', 'total', 'status', 'date', 'actions'];

  orderStatuses = [
    { value: OrderStatus.PENDING, label: 'In Sospeso' },
    { value: OrderStatus.PROCESSING, label: 'In Lavorazione' },
    { value: OrderStatus.SHIPPED, label: 'Spedito' },
    { value: OrderStatus.DELIVERED, label: 'Consegnato' },
    { value: OrderStatus.CANCELLED, label: 'Annullato' }
  ];

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orders = this.adminService.getAllOrders();
  }

  updateOrderStatus(orderId: number, newStatus: OrderStatus) {
    this.adminService.updateOrderStatus(orderId, newStatus);
    this.loadOrders();
    this.snackBar.open('Stato ordine aggiornato', 'Chiudi', {
      duration: 2000
    });
  }

  getStatusClass(status: OrderStatus): string {
    switch(status) {
      case OrderStatus.PENDING: return 'status-pending';
      case OrderStatus.PROCESSING: return 'status-processing';
      case OrderStatus.SHIPPED: return 'status-shipped';
      case OrderStatus.DELIVERED: return 'status-delivered';
      case OrderStatus.CANCELLED: return 'status-cancelled';
      default: return '';
    }
  }

  getStatusLabel(status: OrderStatus): string {
    const found = this.orderStatuses.find(s => s.value === status);
    return found ? found.label : status;
  }
}