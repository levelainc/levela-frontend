import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule, AsyncPipe, NgIf, NgForOf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HousingService } from '../../services/housing.service';
import { Listing } from '../../models/housing.model';
import { TuiBadge, TuiChevron, TuiRating, TuiTab } from '@taiga-ui/kit';
import {
  TuiCardLarge,
  TuiCardMedium,
  TuiCell,
  TuiHeader
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
} from '@taiga-ui/core';
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
  TuiCardLarge,
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
  TuiCell,
  TuiRating,
  
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

}
