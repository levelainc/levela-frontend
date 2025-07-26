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
import { TuiBadge, TuiCarousel, TuiChevron, TuiFilter, TuiPager, TuiPagination, TuiRange, TuiRating, TuiSegmented, TuiStatus, TuiSwitch, TuiTab, TuiTabs } from '@taiga-ui/kit';
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
  TuiPagination

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

}
