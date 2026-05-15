import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ApiResponse } from '../models/api.model';
import { ProductDTO } from '../models/product-api.model';

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/product`;

  /**
   * Get tutti i prodotti
   */
  getAllProducts(): Observable<ApiResponse<ProductDTO[]>> {
    return this.http.get<ApiResponse<ProductDTO[]>>(this.apiUrl);
  }

  /**
   * Get prodotto per ID
   */
  getProductById(id: number): Observable<ApiResponse<ProductDTO>> {
    return this.http.get<ApiResponse<ProductDTO>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get prodotti per categoria
   */
  getProductsByCategory(category: string): Observable<ApiResponse<ProductDTO[]>> {
    return this.http.get<ApiResponse<ProductDTO[]>>(
      `${this.apiUrl}/category/${category}`
    );
  }

  /**
   * Cerca prodotti
   */
  searchProducts(query: string): Observable<ApiResponse<ProductDTO[]>> {
    const params = new HttpParams().set('q', query);
    return this.http.get<ApiResponse<ProductDTO[]>>(
      `${this.apiUrl}/search`,
      { params }
    );
  }

  // ========== ADMIN ENDPOINTS ==========

  /**
   * Crea nuovo prodotto (ADMIN)
   */
  createProduct(product: ProductDTO): Observable<ApiResponse<ProductDTO>> {
    return this.http.post<ApiResponse<ProductDTO>>(
      `${environment.apiUrl}/admin/products`,
      product
    );
  }

  /**
   * Aggiorna prodotto (ADMIN)
   */
  updateProduct(id: number, product: ProductDTO): Observable<ApiResponse<ProductDTO>> {
    return this.http.put<ApiResponse<ProductDTO>>(
      `${environment.apiUrl}/admin/products/${id}`,
      product
    );
  }

  /**
   * Elimina prodotto (ADMIN)
   */
  deleteProduct(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${environment.apiUrl}/admin/products/${id}`
    );
  }

  /**
   * Aggiungi immagine prodotto (ADMIN)
   */
  addProductImage(
    productId: number, 
    file: File, 
    isPrimary: boolean = false
  ): Observable<ApiResponse<ProductDTO>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('isPrimary', isPrimary.toString());

    return this.http.post<ApiResponse<ProductDTO>>(
      `${environment.apiUrl}/admin/products/${productId}/images`,
      formData
    );
  }

  /**
   * Elimina immagine prodotto (ADMIN)
   */
  deleteProductImage(productId: number, imageId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${environment.apiUrl}/admin/products/${productId}/images/${imageId}`
    );
  }

  /**
   * Imposta immagine primaria (ADMIN)
   */
  setPrimaryImage(productId: number, imageId: number): Observable<ApiResponse<ProductDTO>> {
    return this.http.put<ApiResponse<ProductDTO>>(
      `${environment.apiUrl}/admin/products/${productId}/images/${imageId}/primary`,
      {}
    );
  }
}
