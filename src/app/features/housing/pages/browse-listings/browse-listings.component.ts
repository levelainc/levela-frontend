import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  Input,
  Signal,
  signal
} from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HousingService } from '../../services/housing.service';
import { Listing } from '../../models/housing.model';
import { TuiAvatar, TuiAvatarStack, TuiBadge, TuiCarousel, TuiProgressCircle, TuiSkeleton, TuiTabs } from '@taiga-ui/kit';
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
  TuiLoader,
  tuiLoaderOptionsProvider,
} from '@taiga-ui/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, switchMap } from 'rxjs';
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
    TuiSkeleton,
    TuiLoader,
    TuiRepeatTimes,
    TuiProgressCircle,
    TuiAvatarStack,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,



],
providers: [
  tuiLoaderOptionsProvider({
      size: 'xl',
      inheritColor: false,
      overlay: true,
  }),
],
})
export class BrowseListingsComponent implements OnInit {
  private readonly housingService = inject(HousingService);
  protected readonly skeleton=false

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






















  protected readonly exampleControl = new FormControl(100);
  protected readonly exampleYearControl = new FormControl<number | null>(null);
  protected readonly badges = [
      'primary',
      'accent',
      'success',
      'error',
      'warning',
      'neutral',
      'info',
  ];

  protected readonly buttons = ['primary', 'accent', 'destructive', 'flat', 'outline'];

  @Input()
  public theme: Signal<string> = signal('');
}


