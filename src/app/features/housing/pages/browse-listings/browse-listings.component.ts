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
import { TuiAvatar, TuiBadge, TuiCarousel, TuiTabs } from '@taiga-ui/kit';
import {
  TuiCardLarge,
  TuiCardMedium,
  TuiCell,
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
  TuiIcon,
  TuiTextfield,
} from '@taiga-ui/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, switchMap } from 'rxjs';
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
  TuiSurface,
  TuiTitle,
  TuiDropdown,
  TuiDropdownHover,
  TuiDataList,
  TuiIcon,
  TuiButton,
  TuiSearch,
  TuiTextfield,
  TuiCardLarge,
  TuiCell,
  TuiTabs,
  RouterLink,
  TuiBadge,
  TuiCarousel,
  TuiAvatar,

  ],
})
export class BrowseListingsComponent implements OnInit {
  private readonly housingService = inject(HousingService);

  private refresh$=new BehaviorSubject<void>(undefined)
  // listings$ = this.housingService.getAllListings();
  listings$=this.refresh$.pipe(
    switchMap(()=>this.housingService.getAllListings())
  )
  protected open=false
  ngOnInit(): void {
    
  }

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


