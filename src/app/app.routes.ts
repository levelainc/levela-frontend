import { Routes } from '@angular/router';
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
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardPageComponent,canActivate: [AuthGuard], },

  // Housing
  { path: 'housing/browse', component: BrowseListingsComponent },
  { path: 'housing/my', component: MyListingsComponent },
  { path: 'housing/post', component: PostListingComponent },

  // Marketplace
  { path: 'marketplace/products', component: ProductsComponent },
  { path: 'marketplace/orders', component: OrdersComponent },
  { path: 'marketplace/sell', component: SellComponent },
  { path: 'marketplace/categories', component: CategoriesComponent },

  // Services
  { path: 'services/browse', component: BrowseComponent },
  { path: 'services/bookings', component: BookingsComponent },
  { path: 'services/become-provider', component: BecomeProviderComponent },

  // Profile
  { path: 'profile/view', component: ViewProfileComponent },
  { path: 'profile/edit', component: EditProfileComponent },
  { path: 'profile/payments', component: PaymentsComponent },
  { path: 'profile/preferences', component: PreferencesComponent },

  //
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/pages/view-profile/view-profile.component').then(m => m.ViewProfileComponent),
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/profile/pages/preferences/preferences.component').then(m => m.PreferencesComponent),
  },

  // auth
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  // redirect empty path
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' },
];

