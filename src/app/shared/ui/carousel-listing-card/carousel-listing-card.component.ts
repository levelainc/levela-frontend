import { TuiAmountPipe } from '@taiga-ui/addon-commerce';
import { TuiAppearance, TuiGroup, TuiHint, TuiIcon, TuiTitle } from '@taiga-ui/core';
import {TuiFormatDatePipe} from '@taiga-ui/core/pipes/format-date';
import { TuiCardLarge, TuiCell } from '@taiga-ui/layout';
import {RouterLink} from '@angular/router';
import {TuiBadge, TuiBadgedContent, TuiBadgeNotification, TuiCarousel, TuiConnected, TuiPagination, TuiSwitch} from '@taiga-ui/kit';
import { listingImages } from '../../../features/housing/models/housing.model';

import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    inject,
    TemplateRef,
    ViewChild,
    Input,
    Output,
    PLATFORM_ID,
    signal,
} from '@angular/core';
export interface ListingCell {
  title?: string;
  more?: string;
  icon?: any;
  background?:string;
  color?:string;
  price?:number | string;
  actionTheme?:string;
};
export interface ListingPreview {
  title?:string;
  length?:number;
};
import {tuiIsString} from '@taiga-ui/cdk/utils/miscellaneous';
import {TUI_CLOSE_WORD, TUI_COMMON_ICONS} from '@taiga-ui/core/tokens';


import {AsyncPipe, isPlatformServer} from '@angular/common';
import {TUI_IS_E2E, TuiMapperPipe} from '@taiga-ui/cdk';
import {TuiPager, TuiProgress} from '@taiga-ui/kit';
import {map, type Observable, of, takeWhile, tap, timer} from 'rxjs';
import { formatDistance } from 'date-fns';


import {tuiClamp, TuiSwipe, type TuiSwipeEvent} from '@taiga-ui/cdk';
import {TuiAlertService,tuiButtonOptionsProvider, TuiButton, type TuiDialogContext} from '@taiga-ui/core';
import {TuiPreview, TuiPreviewDialogService} from '@taiga-ui/kit';
import {type PolymorpheusContent, PolymorpheusOutlet} from '@taiga-ui/polymorpheus';
@Component({
  selector: 'app-carousel-listing-card',
  imports: [
    TuiPreview,
    TuiSwipe,
    TuiButton,
    TuiFormatDatePipe,
    AsyncPipe,
    TuiCell,
    TuiTitle,
    TuiAmountPipe,
    TuiIcon,
    TuiCarousel,
    TuiAppearance,
    TuiPager,
    TuiProgress,
    TuiMapperPipe,
    TuiGroup,
    TuiBadgedContent,
    TuiHint,
  ],
  templateUrl: './carousel-listing-card.component.html',
  styleUrl: './carousel-listing-card.component.less',
  providers: [tuiButtonOptionsProvider(
    {size: 'm', appearance: 'primary',})],
      host: {
          '[style.--t-lines]': 'lines',
      },
})
export class CarouselListingCardComponent {
  @Input()
  listingImages: listingImages[] = [];

  @Input()
  listingPreview: ListingPreview[] = [];

  @Input()
  count = 0;
  protected readonly isString = tuiIsString;
  protected readonly closeWord = inject(TUI_CLOSE_WORD);
  protected readonly icons = inject(TUI_COMMON_ICONS);

  @Input()
  public heading = '';

  @Input()
  public lines = 3;

  @Input()
  public RoommateIcon = '';

  @Input()
  public maxRoommates: number | string = '';

  @Input()
  public minRoommates: number | string = '';

  @Input()
  public timestamp: number | string = '';

  @Input()
  public cell:ListingCell={}

  @Input()
  public previews:ListingPreview={}

  protected index = 0;
  protected static = inject(TUI_IS_E2E) || isPlatformServer(inject(PLATFORM_ID));
  protected activeIndex = signal(0);

  protected navigate(delta: number): void {
    const count = this.listingImages.length;
    if (count === 0) return;
    this.index = (this.index + delta + count) % count;
  }

    protected get numberOfImages():number{
      if (!this.listingImages.length) return 0;
      return this.listingImages.length
    }
    protected get background(): string {
      if (!this.listingImages.length) return 'url(placeholder.jpg)';
      return `url(${this.listingImages[this.index]?.url || 'placeholder.jpg'})`;
    }

    protected readonly toProgress = (active: boolean): Observable<number> =>
        active && !this.static
            ? timer(0, 1000).pipe(
                  map((i) => i * 5 + 20),
                  takeWhile((value) => value <= 100),
                  tap({complete: () => {
                    this.next()
                    this.navigate(1)
                  }}),
              )
            : of(100);

    protected prev(): void {
        this.activeIndex.update((index) => Math.max(index - 1, 0));
    }

    protected next(): void {
        this.activeIndex.update((index) => Math.min(index + 1, this.count - 1));
    }


    // preview

    private readonly previewService = inject(TuiPreviewDialogService);
    private readonly alerts = inject(TuiAlertService);

    @ViewChild('preview')
    protected readonly preview?: TemplateRef<TuiDialogContext>;

    protected show(): void {
        this.previewService.open(this.preview || '').subscribe();
    }

    protected download(): void {
        this.alerts.open('Downloading...').subscribe();
    }

    protected delete(): void {
        this.alerts.open('Deleting...').subscribe();
    }

    protected onSwipe(swipe: TuiSwipeEvent): void {
        if (swipe.direction === 'left') {
            this.index = tuiClamp(this.index + 1, 0, this.numberOfImages - 1);
        }

        if (swipe.direction === 'right') {
            this.index = tuiClamp(this.index - 1, 0, this.numberOfImages - 1);
        }
    }


    get items():string{
      return this.listingImages?.[this.index]?.url
    }


}
