import { CheckoutItemRequest, CheckoutRequest } from './../../models/order-api.model';
import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CartService } from '../../services/cart';
import { OrderApiService } from '../../services/order-api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent {
  private cartService = inject(CartService);
  private orderApiService = inject(OrderApiService);
  private authService = inject(AuthService);
  private router = inject(Router);

  private snackBar = inject(MatSnackBar);

  cartItems = this.cartService.cartItems;
  cartTotal = this.cartService.cartTotal;
  cartCount = this.cartService.cartCount;

  shippingCost = computed(() => {
    const total = this.cartTotal();
    return total >= 30 ? 0 : 5.90;
  });

  totalWithShipping = computed(() => {
    return this.cartTotal() + this.shippingCost();
  });

  customerData = {
    name: '',
    surname: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    cap: '',
    notes: ''
  };

  removeItem(index: number) {
    this.cartService.removeFromCart(index);
    this.snackBar.open('Prodotto rimosso dal carrello', 'Chiudi', {
      duration: 2000
    });
  }

  updateQuantity(index: number, newQuantity: number) {
    if (newQuantity > 0) {
      this.cartService.updateQuantity(index, newQuantity);
    }
  }

  clearCart() {
    this.cartService.clearCart();
    this.snackBar.open('Carrello svuotato', 'Chiudi', {
      duration: 2000
    });
  }

  goToCheckout() {
    this.snackBar.open('Funzionalità checkout in arrivo!', 'Chiudi', {
      duration: 3000
    });
  }

  continueShopping() {
    this.router.navigate(['/']);
  }

  onCheckout() {
    if(!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], {queryParams: {returnUrl: '/cart'}}); //verica utente loggato, altrimenti reindirizza
      return;
    }
    const items: CheckoutItemRequest[] = this.cartItems().map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
      selectedMaterial: item.selectedMaterial,
      selectedColor: item.selectedColor,
      customizationDetails: item.customizationDetails 
        ? JSON.stringify(item.customizationDetails)
        : undefined
    }));

    // Prepara dati checkout
    const checkoutData: CheckoutRequest = {
      items,
      customerName: this.customerData.name,
      customerSurname: this.customerData.surname,
      customerEmail: this.customerData.email,
      customerPhone: this.customerData.phone,
      shippingAddress: this.customerData.address,
      shippingCity: this.customerData.city,
      shippingCap: this.customerData.cap,
      notes: this.customerData.notes,
      paymentMethod: 'BANK_TRANSFER'
    };

    // Invia ordine al backend
    this.orderApiService.createOrder(checkoutData).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Ordine creato:', response.data);
          this.cartService.clearCart();
          this.router.navigate(['/order-confirmation'], {
            queryParams: { orderId: response.data.id }
          });
        }
      },
      error: (error) => {
        console.error('Errore checkout:', error);
        this.snackBar.open(
          'Errore durante il checkout: ' + error.message, 
          'Chiudi', 
          { duration: 5000 }
        );
      }
    });
  }
}