import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injectable,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import { formatDistance } from 'date-fns';
import { CommonModule, AsyncPipe,isPlatformBrowser } from '@angular/common';
import { HousingService } from '../../services/housing.service';
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
import { BehaviorSubject,type Observable,of, switchMap, timer,map, filter} from 'rxjs';
import { CarouselListingCardComponent } from '../../../../shared/ui/carousel-listing-card/carousel-listing-card.component';
import { NavigationEnd, Router,type Routes } from '@angular/router';
import { HousingNavComponent } from '../../../../shared/ui/housing-nav/housing-nav.component';
import { InfosectionComponent } from '../../../../shared/ui/infosection/infosection.component';

@Injectable()
export class FormatService extends TuiFormatDateService{
  private readonly delay$ = isPlatformBrowser(inject(PLATFORM_ID))
  ? timer(0, 1000)
  : of(0);
  public override format(timestamp:number):Observable<string>{
    return  this.delay$.pipe(
      map(()=>formatDistance(new Date(timestamp),new Date(),{addSuffix:true})))
  }
}
@Component({
  standalone: true,
  selector: 'app-browse-listings',
  templateUrl: './browse-listings.component.html',
  styleUrls: ['./browse-listings.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HousingNavComponent,
    InfosectionComponent,
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
export class BrowseListingsComponent implements OnInit{
  showInfoSection=false;
  showHousingNav=false;
  showCreateListingNav=false
  constructor(private router:Router){
    this.router.events
    .pipe(filter(event=>event instanceof NavigationEnd))
    .subscribe((e: NavigationEnd)=>{
      this.showHousingNav=e.urlAfterRedirects.startsWith('/housing')
      this.showInfoSection=e.urlAfterRedirects.startsWith('/housing/')
      this.showCreateListingNav=e.urlAfterRedirects.startsWith('/housing/create')
    })
  }
  private readonly housingService = inject(HousingService);
  private refresh$=new BehaviorSubject<void>(undefined)
  listings$ = this.refresh$.pipe(
    switchMap(() => this.housingService.getAllListings()),
    map(listings =>
      listings.map(listing => ({
        ...listing,
        created_at: listing.created_at
          ? new Date(listing.created_at + 'Z')
          : null
      }))
    )
  );

  topListings$ = this.refresh$.pipe(
    switchMap(() => this.housingService.getTopListings()),
    map(listings =>
      listings.map(listing => ({
        ...listing,
        created_at: listing.created_at
          ? new Date(listing.created_at + 'Z')
          : null
      }))
    )
  );

  protected readonly urls = ['', 'all-listings'];
  topFilters: string[] = [];
  ngOnInit(): void {
    this.housingService.getTopFilters().subscribe(filters => {
      this.topFilters = filters;
    });
  }


}


