import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent)
  },
  {
    path: 'stampe3d',
    loadComponent: () => import('./pages/stampe3d/stampe3d').then(m => m.Stampe3dComponent)
  },
  {
    path: 'modelli-stampa',
    loadComponent: () => import('./pages/modelli-stampa/modelli-stampa').then(m => m.ModelliStampaComponent)
  },
  {
    path: 'laser/oggetti',
    loadComponent: () => import('./pages/laser/laser').then(m => m.LaserComponent),
    data: { type: 'oggetti' }
  },
  {
    path: 'laser/stoffa',
    loadComponent: () => import('./pages/laser/laser').then(m => m.LaserComponent),
    data: { type: 'stoffa' }
  },
  {
    path: 'adesivi',
    loadComponent: () => import('./pages/adesivi/adesivi').then(m => m.AdesiviComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart').then(m => m.CartComponent),
    //canActivate: [authGuard] 
  },
  {
    path: 'contatti',
    loadComponent: () => import('./pages/contatti/contatti').then(m => m.ContattiComponent)
  },
  {
    path: 'admin',
    canActivate: [adminGuard], 
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./pages/admin/product-management/product-management').then(m => m.ProductManagementComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./pages/admin/orders-history/orders-history').then(m => m.OrdersHistoryComponent)
      }
    ]
  },
    // LOGIN - TODO
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register').then(m => m.RegisterComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
