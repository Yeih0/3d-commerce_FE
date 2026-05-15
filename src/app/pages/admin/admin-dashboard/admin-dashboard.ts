import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { ProductService } from '../../../services/product';
import { AdminService } from '../../../services/admin';
import { CartService } from '../../../services/cart';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent implements OnInit {
  private productService = inject(ProductService);
  private adminService = inject(AdminService);
  private cartService = inject(CartService);
  private router = inject(Router);

  stats = {
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0
  };

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.stats.totalProducts = this.productService.getAllProducts().length;
    const orders = this.adminService.getAllOrders();
    this.stats.totalOrders = orders.length;
    this.stats.pendingOrders = orders.filter(o => o.status === 'PENDING').length;
    this.stats.revenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}