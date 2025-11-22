import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, AsyncPipe, DatePipe } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import {  of } from 'rxjs';
import { HousingService } from '../../services/housing.service';
import {
  TuiSurface,
  TuiTitle,
  TuiAppearance,
  TuiGroup,
  TuiAutoColorPipe,
  TuiIcon,
  TuiLink,
  TuiScrollable,
  TuiScrollbar,
} from '@taiga-ui/core';
import { TuiButton } from '@taiga-ui/core';
import { TuiAvatar, TuiBadge, TuiChip, TuiFade, TuiLike } from '@taiga-ui/kit';
import { TuiCardLarge, TuiCardMedium, TuiCell } from '@taiga-ui/layout';
import { HousingListingCardComponent } from '../../../../shared/ui/housing-listing-card/housing-listing-card.component';
import { TuiAmountPipe } from '@taiga-ui/addon-commerce';

@Component({
  standalone: true,
  selector: 'app-listing-detail',
  templateUrl: './listing-detail.component.html',
  styleUrls: ['./listing-detail.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HousingListingCardComponent,
    CommonModule,
    AsyncPipe,
    DatePipe,
    TuiBadge,
    TuiSurface,
    TuiTitle,
    TuiCardLarge,
    TuiButton,
    TuiCardMedium,
    TuiCell,
    TuiAppearance,
    TuiGroup,
    TuiAvatar,
    TuiChip,
    TuiAutoColorPipe,
    TuiAmountPipe,
    TuiIcon,
    TuiAmountPipe,
    TuiLink,
    TuiFade,
    TuiScrollable,
    TuiScrollbar,
    TuiLike,
],
})
export class ListingDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly housingService = inject(HousingService);
  private readonly router = inject(Router);

  // The listing we are showing
  listing$ = this.route.paramMap.pipe(
    switchMap(params => {
      const id = params.get('id');
      return id ? this.housingService.getListingById(id) : of(null);
    })
  );

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });

  }

  backToBrowse(): void {
    this.router.navigate(['/housing']);
  }
}



