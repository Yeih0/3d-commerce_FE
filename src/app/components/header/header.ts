import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart';
import { MatDividerModule } from '@angular/material/divider';
import { UserDTO } from '../../models/api.model';
import { map, Observable } from 'rxjs';
import { AuthDialogService } from '../../services/auth-dialog.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatTooltipModule,
    MatDividerModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);
  private authDialogService = inject(AuthDialogService);

  isAuthenticated$ = this.authService.isAuthenticated$;
  currentUser$ = this.authService.currentUser$;
  cartCount = this.cartService.cartCount;

  isAdmin$: Observable<boolean> = this.currentUser$.pipe(
    map((user: UserDTO | null) => user?.role === 'ADMIN')
  );

  // logging

  openLogin(): void {
    this.authDialogService.openLogin();
  }

  openRegister(): void {
    this.authDialogService.openRegister();
  }

  logout() {
    this.authService.logout();
  }
}