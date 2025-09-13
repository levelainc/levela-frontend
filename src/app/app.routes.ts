import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Redirect root to housing listings
  { path: '', redirectTo: 'housing', pathMatch: 'full' },

  // Dashboard
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/pages/dashboard-page/dashboard-page.component').then(
        m => m.DashboardPageComponent
      ),
    canActivate: [AuthGuard],
  },

  // Housing (lazy-loaded)
  {
    path: 'housing',
    loadChildren: () =>
      import('./features/housing/housing.routes').then(m => m.HOUSING_ROUTES),
  },

  // Marketplace
  {
    path: 'marketplace/products',
    loadComponent: () =>
      import('./features/marketplace/pages/products/products.component').then(
        m => m.ProductsComponent
      ),
  },
  {
    path: 'marketplace/orders',
    loadComponent: () =>
      import('./features/marketplace/pages/orders/orders.component').then(
        m => m.OrdersComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'marketplace/sell',
    loadComponent: () =>
      import('./features/marketplace/pages/sell/sell.component').then(
        m => m.SellComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'marketplace/categories',
    loadComponent: () =>
      import('./features/marketplace/pages/categories/categories.component').then(
        m => m.CategoriesComponent
      ),
  },

  // Services
  {
    path: 'services/browse',
    loadComponent: () =>
      import('./features/services/pages/browse/browse.component').then(
        m => m.BrowseComponent
      ),
  },
  {
    path: 'services/bookings',
    loadComponent: () =>
      import('./features/services/pages/bookings/bookings.component').then(
        m => m.BookingsComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'services/become-provider',
    loadComponent: () =>
      import('./features/services/pages/become-provider/become-provider.component').then(
        m => m.BecomeProviderComponent
      ),
    canActivate: [AuthGuard],
  },

  // Profile
  {
    path: 'profile/view',
    loadComponent: () =>
      import('./features/profile/pages/view-profile/view-profile.component').then(
        m => m.ViewProfileComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'profile/edit',
    loadComponent: () =>
      import('./features/profile/pages/edit-profile/edit-profile.component').then(
        m => m.EditProfileComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'profile/payments',
    loadComponent: () =>
      import('./features/profile/pages/payments/payments.component').then(
        m => m.PaymentsComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'profile/preferences',
    loadComponent: () =>
      import('./features/profile/pages/preferences/preferences.component').then(
        m => m.PreferencesComponent
      ),
    canActivate: [AuthGuard],
  },

  // Auth & Onboarding
  {
    path: 'auth/verify-email',
    loadComponent: () =>
      import('./features/auth/pages/email-verification.component').then(
        m => m.EmailVerificationComponent
      ),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'onboarding',
    loadChildren: () =>
      import('./features/onboarding/onboarding.module').then(m => m.OnboardingModule),
  },

  // Fallback
  { path: '**', redirectTo: 'housing' },
];
