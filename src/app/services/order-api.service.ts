import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ApiResponse } from '../models/api.model';
import { 
  OrderDTO, 
  CheckoutRequest, 
  UpdateOrderStatusRequest 
} from '../models/order-api.model';

@Injectable({
  providedIn: 'root'
})
export class OrderApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/orders`;

  /**
   * Crea nuovo ordine (Checkout)
   */
  createOrder(checkoutData: CheckoutRequest): Observable<ApiResponse<OrderDTO>> {
    return this.http.post<ApiResponse<OrderDTO>>(
      `${this.apiUrl}/checkout`,
      checkoutData
    );
  }

  /**
   * Get ordini dell'utente corrente
   */
  getMyOrders(): Observable<ApiResponse<OrderDTO[]>> {
    return this.http.get<ApiResponse<OrderDTO[]>>(`${this.apiUrl}/my-orders`);
  }

  /**
   * Get dettaglio ordine
   */
  getOrderById(orderId: number): Observable<ApiResponse<OrderDTO>> {
    return this.http.get<ApiResponse<OrderDTO>>(`${this.apiUrl}/${orderId}`);
  }

  // ========== ADMIN ENDPOINTS ==========

  /**
   * Get tutti gli ordini (ADMIN)
   */
  getAllOrders(): Observable<ApiResponse<OrderDTO[]>> {
    return this.http.get<ApiResponse<OrderDTO[]>>(
      `${environment.apiUrl}/admin/orders`
    );
  }

  /**
   * Aggiorna stato ordine (ADMIN)
   */
  updateOrderStatus(
    orderId: number, 
    statusData: UpdateOrderStatusRequest
  ): Observable<ApiResponse<OrderDTO>> {
    return this.http.put<ApiResponse<OrderDTO>>(
      `${environment.apiUrl}/admin/orders/${orderId}/status`,
      statusData
    );
  }

  /**
   * Elimina ordine (ADMIN)
   */
  deleteOrder(orderId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${environment.apiUrl}/admin/orders/${orderId}`
    );
  }
}
