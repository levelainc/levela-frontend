import { ChangeDetectionStrategy, Component, inject, Input,OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterLink, RouterOutlet,type Routes } from '@angular/router';
import { TuiItem } from '@taiga-ui/cdk';
import { TuiButton, TuiFormatDatePipe, TuiHint, TuiIcon, TuiScrollable, TuiScrollbar, TuiTitle } from '@taiga-ui/core';
import { TuiChip, TuiLike, TuiSlides, TuiTab, TuiTabsWithMore } from '@taiga-ui/kit';
import { TuiCell, TuiNavigation } from '@taiga-ui/layout';
import { filter, map, pairwise } from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop';
// Import your HousingService and Listing model
import { Listing } from '../../../features/housing/models/housing.model';
import { HousingService } from '../../../features/housing/services/housing.service';
import { CarouselListingCardComponent } from '../carousel-listing-card/carousel-listing-card.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { formatDistance } from 'date-fns';

@Component({
  selector: 'app-housing-nav',
  templateUrl: './housing-nav.component.html',
  styleUrls: ['./housing-nav.component.less'],
  standalone: true,
  imports: [
    TuiNavigation,
    TuiIcon,
    TuiButton,
    TuiTabsWithMore,
    TuiItem,
    RouterLink,
    RouterOutlet,
    TuiTab,
    TuiTitle,
    TuiHint,
    CarouselListingCardComponent,
    TuiScrollbar,
    TuiScrollable,
    TuiChip,
    TuiFormatDatePipe,
    AsyncPipe,
    CommonModule,
    TuiLike,
    TuiSlides
  ],
})
export class HousingNavComponent {

  @Input() topFilters: string[] = [];

  activeTabIndex = 0;
  showHousingNav = false;
  showCreateListingNav = false;
  showInfoSection = false;

  listingsByFilter: Record<string, Listing[]> = {};

  constructor(private router: Router, private housingService: HousingService) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.showHousingNav = e.urlAfterRedirects.startsWith('/housing');
        this.showInfoSection = e.urlAfterRedirects.startsWith('/housing/');
        this.showCreateListingNav = e.urlAfterRedirects.startsWith('/housing/create');
      });
  }

  ngOnInit() {
    // Load top filters if not provided via Input
    if (!this.topFilters.length) {
      this.housingService.getTopFilters().subscribe({
        next: (filters) => {
          this.topFilters = filters;

          // Initialize listings record
          filters.forEach(f => this.listingsByFilter[f] = []);

          // Load first tab by default
          if (filters.length) this.loadListings(filters[0]);
        },
        error: (err) => console.error(err)
      });
    } else {
      // Initialize listings record for input filters
      this.topFilters.forEach(f => this.listingsByFilter[f] = []);
      if (this.topFilters.length) this.loadListings(this.topFilters[0]);
    }
  }

  // Lazy load listings for the active tab
  loadListings(filter: string) {
    if (this.listingsByFilter[filter]?.length) return; // already loaded

    this.housingService.getListingsByFilter(filter).subscribe({
      next: (res) => this.listingsByFilter[filter] = res,
      error: (err) => console.error(err),
    });
  }

  // Called when tab changes
  onTabChange(index: number) {
    this.activeTabIndex = index;
    const filter = this.topFilters[index];
    this.loadListings(filter);
    window.scrollTo({ top: 2, behavior: 'smooth' });
  }

  // slides transition
  protected readonly direction = toSignal(
    inject(Router).events.pipe(
        filter((event) => event instanceof NavigationStart),
        map(({url}: any) => Number(url.split('/').at(-1))),
        pairwise(),
        map(([prev, next]) => next - prev),
    ),
    {initialValue: 1},
);

}

