import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ApiResponse } from '../models/api.model';

export interface ContactMessageRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}

export interface ContactMessageDTO {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  isRead: boolean;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ContactApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/contact`;

  /**
   * Invia messaggio di contatto
   */
  sendMessage(message: ContactMessageRequest): Observable<ApiResponse<ContactMessageDTO>> {
    return this.http.post<ApiResponse<ContactMessageDTO>>(
      this.apiUrl,
      message
    );
  }

  // ========== ADMIN ENDPOINTS ==========

  /**
   * Get tutti i messaggi (ADMIN)
   */
  getAllMessages(): Observable<ApiResponse<ContactMessageDTO[]>> {
    return this.http.get<ApiResponse<ContactMessageDTO[]>>(
      `${environment.apiUrl}/admin/contacts`
    );
  }

  /**
   * Segna messaggio come letto (ADMIN)
   */
  markAsRead(messageId: number): Observable<ApiResponse<ContactMessageDTO>> {
    return this.http.put<ApiResponse<ContactMessageDTO>>(
      `${environment.apiUrl}/admin/contacts/${messageId}/read`,
      {}
    );
  }

  /**
   * Elimina messaggio (ADMIN)
   */
  deleteMessage(messageId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${environment.apiUrl}/admin/contacts/${messageId}`
    );
  }
}
