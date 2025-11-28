import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injectable
} from '@angular/core';

import { formatDistance, toDate } from 'date-fns';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { HousingService } from '../../services/housing.service';
import { Listing } from '../../models/housing.model';
import { TuiAvatar,TuiCarousel, TuiChip, TuiFade, TuiLike, TuiPush, TuiTabs } from '@taiga-ui/kit';
import {
  TuiCard,
  TuiCardLarge,
  TuiCell,
  TuiSearch
} from '@taiga-ui/layout';
import {
  TuiButton,
  TuiTitle,
  TuiAppearance,
  TuiDropdown,
  TuiDataList,
  TuiIcon,
  TuiTextfield,
  TuiLoader,
  tuiLoaderOptionsProvider,
  TuiScrollbar,
  TuiScrollable,
  TuiFormatDatePipe,
  TuiFormatDateService,
} from '@taiga-ui/core';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, switchMap, timer,map} from 'rxjs';
import { CarouselListingCardComponent } from '../../../../shared/ui/carousel-listing-card/carousel-listing-card.component';

@Injectable()
export class FormatService extends TuiFormatDateService{
  public override format(timestamp:number):Observable<string>{
    return  timer(0,1000).pipe(map(()=>formatDistance(timestamp,Date.now())))
  }
}

@Component({
  standalone: true,
  selector: 'app-browse-listings',
  templateUrl: './browse-listings.component.html',
  styleUrls: ['./browse-listings.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    AsyncPipe,
    TuiAppearance,
    TuiButton,
    TuiTitle,
    TuiDropdown,
    TuiDataList,
    TuiIcon,
    TuiButton,
    TuiSearch,
    TuiTextfield,
    TuiCardLarge,
    TuiCell,
    TuiTabs,
    TuiCarousel,
    TuiAvatar,
    TuiLoader,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    TuiPush,
    TuiCard,
    CarouselListingCardComponent,
    TuiChip,
    TuiScrollbar,
    TuiScrollable,
    TuiLike,
    TuiFade,
    TuiFormatDatePipe,
],
providers: [
  tuiLoaderOptionsProvider({
      size: 'xl',
      inheritColor: false,
      overlay: true,
  }),
  {
    provide: TuiFormatDateService,
    useClass: FormatService,
  }
],
})
export class BrowseListingsComponent {
  private readonly housingService = inject(HousingService);
  private refresh$=new BehaviorSubject<void>(undefined)
  listings$ = this.refresh$.pipe(
    switchMap(() => this.housingService.getAllListings()),
    map(listings =>
      listings.map(listing => ({
        ...listing,
        created_at: listing.created_at
          ? new Date(listing.created_at.replace(' ', 'T') + ':00')
          : null
      }))
    )
  );

}


