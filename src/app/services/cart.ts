import {
  computed,
  Injectable,
  signal,
  inject,
  PLATFORM_ID
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  private platformId = inject(PLATFORM_ID);

  private cartItemsSignal = signal<CartItem[]>([]);

  cartItems = this.cartItemsSignal.asReadonly();

  cartCount = computed(() => this.cartItemsSignal().length);

  cartTotal = computed(() =>
    this.cartItemsSignal().reduce(
      (total, item) => total + item.totalPrice,
      0
    )
  );

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const saved = localStorage.getItem('cart');

    if (saved) {
      try {
        this.cartItemsSignal.set(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading cart:', e);
      }
    }
  }

  addToCart(
    product: Product,
    quantity: number = 1,
    selectedMaterial?: string,
    selectedColor?: string,
    customizationDetails?: any
  ): void {

    const totalPrice = product.price * quantity;

    const cartItem: CartItem = {
      product,
      quantity,
      selectedMaterial,
      selectedColor,
      customizationDetails,
      totalPrice
    };

    const currentItems = this.cartItemsSignal();

    this.cartItemsSignal.set([
      ...currentItems,
      cartItem
    ]);

    this.saveCart();
  }

  removeFromCart(index: number): void {

    const currentItems = this.cartItemsSignal();

    this.cartItemsSignal.set(
      currentItems.filter((_, i) => i !== index)
    );

    this.saveCart();
  }

  updateQuantity(index: number, quantity: number): void {

    const currentItems = this.cartItemsSignal();

    if (currentItems[index]) {

      currentItems[index].quantity = quantity;

      currentItems[index].totalPrice =
        currentItems[index].product.price * quantity;

      this.cartItemsSignal.set([...currentItems]);

      this.saveCart();
    }
  }

  private saveCart(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.setItem(
      'cart',
      JSON.stringify(this.cartItemsSignal())
    );
  }

  clearCart(): void {

    this.cartItemsSignal.set([]);

    this.saveCart();
  }
}