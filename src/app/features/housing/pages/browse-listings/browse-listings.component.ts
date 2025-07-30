import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule, AsyncPipe, NgIf, NgForOf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HousingService } from '../../services/housing.service';
import { Listing } from '../../models/housing.model';
import { TuiAvatar, TuiBadge, TuiCarousel, TuiChevron, TuiFilter, TuiPager, TuiPagination, TuiRange, TuiRating, TuiSegmented, TuiStatus, TuiSwitch, TuiTab, TuiTabs } from '@taiga-ui/kit';
import {
  TuiCardLarge,
  TuiCardMedium,
  TuiCell,
  TuiForm,
  TuiHeader,
  TuiSearch
} from '@taiga-ui/layout';
import {
  TuiButton,
  TuiTitle,
  TuiAppearance,
  TuiSurface,
  TuiDropdown,
  TuiDropdownHover,
  TuiDataList,
  TuiDropdownOpen,
  TuiIcon,
  TuiTextfield,
  TuiLabel,
  TuiNotification,
} from '@taiga-ui/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiRepeatTimes } from '@taiga-ui/cdk';
import { of,Observable } from 'rxjs';
@Component({
  standalone: true,
  selector: 'app-browse-listings',
  templateUrl: './browse-listings.component.html',
  styleUrls: ['./browse-listings.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
  CommonModule,
  AsyncPipe,
  NgForOf,
  NgIf,
  RouterLink,
  TuiAppearance,
  TuiBadge,
  TuiButton,
  TuiCardMedium,
  TuiHeader,
  TuiSurface,
  TuiTitle,
  TuiDropdown,
  TuiDropdownHover,
  TuiDataList,
  TuiChevron,
  TuiDropdownOpen,
  TuiTab,
  TuiIcon,
  TuiButton,
  TuiSearch,
  TuiTextfield,
  TuiSegmented,
  TuiFilter,
  TuiForm,
  ReactiveFormsModule,
  TuiSwitch,
  TuiLabel,
  TuiSwitch,
  TuiCardLarge,
  TuiCell,
  TuiTabs,
  RouterLink,
  TuiTab,
  RouterLinkActive,
  TuiBadge,
  TuiStatus,
  TuiNotification,
  TuiCarousel,
  TuiRepeatTimes,
  TuiPagination,
  TuiAvatar

  ],
})
export class BrowseListingsComponent implements OnInit {
  private readonly housingService = inject(HousingService);
  listings$ = this.housingService.getAllListings();
  protected open=false
  ngOnInit(): void {}

  getImageUrl(listing: Listing): string {
    return listing.images?.[0]?.url || 'placeholder.jpg';
  }

  readonly form = new FormGroup({
    location: new FormControl(''),
    roomType: new FormControl(''),
    priceRange: new FormControl([0, 100]),
    verified: new FormControl(false),
    segmented: new FormControl(null),
    filter: new FormControl([]),
    assignedToMe: new FormControl(false),
  });

  readonly items = ['Apartment', 'Hostel', 'Bedsitter'];
  readonly filters = ['Balcony', 'Pet-friendly', 'Self-contained'];
  activeItemIndex=0;
  protected count = 3;
  protected index = 0;


  housingTypes = [
    { name: 'Hostels', icon: 'placeholder.jpg' },
    { name: 'Bedsitters', icon: 'placeholder.jpg' },
    { name: 'Shared Units', icon: 'placeholder.jpg' },
    { name: 'Studios', icon: 'placeholder.jpg' },
  ];

  topHosts = [
    { name: 'Mama Mary Homes', avatar: 'placeholder.jpg', listings: 14 },
    { name: 'Campus Nest', avatar: 'placeholder.jpg', listings: 22 },
    { name: 'KE Roomie', avatar: 'placeholder.jpg', listings: 9 },
  ];

  // deals of the week
  featuredDeal = {
    title: 'Student Dream Room',
    location: 'Nairobi CBD',
    price: 'KES 9,500/mo',
    image: 'placeholder.jpg'
  };

  // Right-side grid of weekly deals
  weeklyDeals$: Observable<Deal[]> = of([
    {
      title: '1BR Bedsitter',
      location: 'Kasarani',
      price: 'KES 7,000',
      image: 'placeholder.jpg'
    },
    {
      title: 'Modern Hostel',
      location: 'Juja',
      price: 'KES 6,000',
      image: 'placeholder.jpg'
    },
    {
      title: 'Shared Flat',
      location: 'Thika Road',
      price: 'KES 5,500',
      image: 'placeholder.jpg'
    },
    {
      title: 'Private Studio',
      location: 'Ngong Rd',
      price: 'KES 10,000',
      image: 'placeholder.jpg'
    },
    {
      title: 'Deluxe Room',
      location: 'Westlands',
      price: 'KES 12,000',
      image: 'placeholder.jpg'
    },
    {
      title: 'Budget Room',
      location: 'Embakasi',
      price: 'KES 4,800',
      image: 'placeholder.jpg'
    }
  ]);
}

interface Deal {
  title: string;
  location: string;
  price: string;
  image: string;
}

