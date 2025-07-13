import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, AsyncPipe, NgIf } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { HousingService } from '../../services/housing.service';

@Component({
  standalone: true,
  selector: 'app-listing-detail',
  templateUrl: './listing-detail.component.html',
  styleUrls: ['./listing-detail.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AsyncPipe, NgIf],
})
export class ListingDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly housingService = inject(HousingService);

  listing$ = this.route.paramMap.pipe(
    switchMap(params => {
      const id = params.get('id');
      return id ? this.housingService.getListingById(id) : of(null);
    })
  );

  ngOnInit(): void {}
}
