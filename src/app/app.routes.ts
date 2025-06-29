import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

import { DashboardPageComponent } from './features/dashboard/pages/dashboard-page/dashboard-page.component';
import { BrowseListingsComponent } from './features/housing/pages/browse-listings/browse-listings.component';
import { MyListingsComponent } from './features/housing/pages/my-listings/my-listings.component';
import { PostListingComponent } from './features/housing/pages/post-listing/post-listing.component';

import { ProductsComponent } from './features/marketplace/pages/products/products.component';
import { OrdersComponent } from './features/marketplace/pages/orders/orders.component';
import { SellComponent } from './features/marketplace/pages/sell/sell.component';
import { CategoriesComponent } from './features/marketplace/pages/categories/categories.component';

import { BrowseComponent } from './features/services/pages/browse/browse.component';
import { BookingsComponent } from './features/services/pages/bookings/bookings.component';
import { BecomeProviderComponent } from './features/services/pages/become-provider/become-provider.component';

import { ViewProfileComponent } from './features/profile/pages/view-profile/view-profile.component';
import { EditProfileComponent } from './features/profile/pages/edit-profile/edit-profile.component';
import { PaymentsComponent } from './features/profile/pages/payments/payments.component';
import { PreferencesComponent } from './features/profile/pages/preferences/preferences.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Dashboard (Protected)
  { path: 'dashboard', component: DashboardPageComponent, canActivate: [AuthGuard] },

  // Housing (Browse = Public, others = Protected)
  { path: 'housing/browse', component: BrowseListingsComponent },
  { path: 'housing/my', component: MyListingsComponent, canActivate: [AuthGuard] },
  { path: 'housing/post', component: PostListingComponent, canActivate: [AuthGuard] },

  // Marketplace
  { path: 'marketplace/products', component: ProductsComponent },
  { path: 'marketplace/orders', component: OrdersComponent, canActivate: [AuthGuard] },
  { path: 'marketplace/sell', component: SellComponent, canActivate: [AuthGuard] },
  { path: 'marketplace/categories', component: CategoriesComponent },

  // Services
  { path: 'services/browse', component: BrowseComponent },
  { path: 'services/bookings', component: BookingsComponent, canActivate: [AuthGuard] },
  { path: 'services/become-provider', component: BecomeProviderComponent, canActivate: [AuthGuard] },

  // Profile
  { path: 'profile/view', component: ViewProfileComponent, canActivate: [AuthGuard] },
  { path: 'profile/edit', component: EditProfileComponent, canActivate: [AuthGuard] },
  { path: 'profile/payments', component: PaymentsComponent, canActivate: [AuthGuard] },
  { path: 'profile/preferences', component: PreferencesComponent, canActivate: [AuthGuard] },

  // Lazy-loaded or dynamic pages
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/pages/view-profile/view-profile.component').then(m => m.ViewProfileComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/profile/pages/preferences/preferences.component').then(m => m.PreferencesComponent),
    canActivate: [AuthGuard],
  },

  // Email Verification Page
  {
    path: 'auth/verify-email',
    loadComponent: () =>
      import('./features/auth/pages/email-verification.component').then(
        (m) => m.EmailVerificationComponent
      ),
  },

  // Auth module (lazy-loaded)
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  },

  // Onboarding module (lazy)
  {
    path: 'onboarding',
    loadChildren: () =>
      import('./features/onboarding/onboarding.module').then((m) => m.OnboardingModule),
  },

  // Catch-all
  { path: '**', redirectTo: '/dashboard' },
];
