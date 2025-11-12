import { Routes } from '@angular/router';
import { BrowseListingsComponent } from './pages/browse-listings/browse-listings.component';
import { CreateListingComponent } from './pages/create-listing/create-listing.component';
import { MyListingsComponent } from './pages/my-listings/my-listings.component';
import { ListingDetailComponent } from './pages/listing-detail/listing-detail.component';
import { AuthGuard } from '../../core/guards/auth.guard';

export const HOUSING_ROUTES: Routes = [
  {
    path: '',
    component: BrowseListingsComponent,
    title: 'Browse Listings',
  },

  {
    path: 'create',
    component: CreateListingComponent,
    title: 'Post New Listing',
    canActivate: [AuthGuard],
  },
  {
    path: 'mine',
    component: MyListingsComponent,
    title: 'My Listings',
    canActivate: [AuthGuard],
  },
  {
    path: ':id',
    component: ListingDetailComponent,
    title: 'Listing Details',
  },
    {
    path: '**',
    redirectTo:'',
    pathMatch:"full",
  },
];
