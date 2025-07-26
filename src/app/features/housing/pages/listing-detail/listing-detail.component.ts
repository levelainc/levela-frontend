import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, AsyncPipe, NgIf, DatePipe } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { HousingService } from '../../services/housing.service';
import {
  TuiSurface,
  TuiTitle,
  TuiIcon,
  TuiAppearance,
  TuiGroup,
} from '@taiga-ui/core';
import { TuiButton } from '@taiga-ui/core';
import { TuiAvatar, TuiBadge } from '@taiga-ui/kit';
import { TuiCardLarge, TuiCardMedium, TuiCell } from '@taiga-ui/layout';

@Component({
  standalone: true,
  selector: 'app-listing-detail',
  templateUrl: './listing-detail.component.html',
  styleUrls: ['./listing-detail.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    AsyncPipe,
    NgIf,
    DatePipe,
    TuiBadge,
    TuiSurface,
    TuiTitle,
    TuiIcon,
    TuiCardLarge,
    TuiButton,
    TuiCardMedium,
    TuiCell,
    TuiAppearance,
    TuiGroup,
    TuiAvatar
  ],
})
export class ListingDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly housingService = inject(HousingService);
  private readonly router = inject(Router);

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

  addons = [
    'Less than 30 min from campus',
    'Furnished',
    'Tiled',
    'Secure',
    'Running water 24/7',
    'WIFI',
    'Near city center'
  ];

}
