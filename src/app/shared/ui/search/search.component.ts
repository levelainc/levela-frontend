import { Component, inject, Injectable, OnInit, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiAppearance, TuiButton, TuiDataList, TuiFormatDatePipe, TuiFormatDateService, TuiIcon, TuiLabel, TuiLoader, TuiSelectLike, TuiTextfield, TuiTextfieldDropdownDirective, TuiTitle } from '@taiga-ui/core';
import {
  TuiFilter,
  TuiSkeleton,
  TuiSwitch,
  TuiChevron,
  TuiDataListWrapper,
  TuiFilterByInputPipe,
  TuiInputChip,
  TuiMultiSelect,
  TuiMultiSelectGroupDirective,
  TuiSelect,
  TuiTooltip,
  TuiAvatar,
  TuiConnected,
  TuiAvatarOutline,
   } from '@taiga-ui/kit';
  import {TuiPlatform,type TuiBooleanHandler} from '@taiga-ui/cdk';
import { TuiForm, TuiSearch, TuiInputSearch, TuiCell, TuiCardLarge } from '@taiga-ui/layout';
import { HousingService } from '../../../features/housing/services/housing.service';
import { formatDistance } from 'date-fns';
import { TuiDropdownMobile } from '@taiga-ui/addon-mobile';
import { Listing } from '../../../features/housing/models/housing.model';
import { RouterLink } from '@angular/router';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { timer,of, Observable, map } from 'rxjs';
import { TuiAmountPipe } from '@taiga-ui/addon-commerce';
interface ListingsQueryParams {
  filter?: string;
  location?: string;
  min_price?: string;
  max_price?: string;
  roommates?: string;
  page?: number;
  per_page?: number;
}
interface ListingFilters {
  houseTypes: string[];
  gender?: string;
  verified?: string;
}

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
  selector: 'app-search',
  imports: [
    TuiForm,
    TuiTextfield,
    TuiSearch,
    TuiIcon,
    ReactiveFormsModule,
    TuiFilter,
    TuiSkeleton,
    TuiLoader,
    TuiSwitch,
    TuiLabel,
    TuiButton,
    TuiMultiSelect,
    TuiDataListWrapper,
    TuiFilterByInputPipe,
    TuiChevron,
    TuiInputChip,
    TuiSelectLike,
    TuiTextfieldDropdownDirective,
    TuiDropdownMobile,
    TuiMultiSelectGroupDirective,
    FormsModule,
    TuiDataList,
    TuiAppearance,
    TuiPlatform,
    TuiSelect,
    TuiTooltip,
    TuiCell,
    TuiAvatar,
    TuiTitle,
    TuiConnected,
    TuiCardLarge,
    RouterLink,
    TuiAvatarOutline,
    TuiFormatDatePipe,
    AsyncPipe,
    TuiAmountPipe
],
  templateUrl: './search.component.html',
  styleUrl: './search.component.less',
  providers:[
    {
        provide: TuiFormatDateService,
        useClass: FormatService,
      }
  ]
})
export class SearchComponent implements OnInit{
  private readonly housingService=inject(HousingService)
  topFilters: string[] = [];
  filteredListings: Listing[] = [];
  protected loading=false

  protected readonly usersGender=['Male','Female','Other'] as const;
  protected readonly verified=['Verified','Unverified'] as const;

  ngOnInit(): void {
    this.housingService.getTopFilters().subscribe(filters => {
      this.topFilters = filters;
      // if(filters.length) this.loading=false
    });
  }

  readonly form=new FormGroup({
    select:new FormControl<string[]>([],Validators.required),
    gender:new FormControl(''),
    verified:new FormControl('')
  })

  protected readonly platforms = ['web', 'ios', 'android'] as const;
  protected value: 'android' | 'ios' | 'web' | null = 'android';
  protected readonly disabledItemHandler: TuiBooleanHandler<string> = (x) =>
      x === 'android';

  get verifiedIcon() {
    const value = this.form.controls.verified.value;

    switch (value) {
      case 'Verified':
        return { icon: '@tui.badge-check', tooltip: 'Safety guarantee', appearance: 'positive' };
      case 'Unverified':
        return { icon: '@tui.octagon-alert', tooltip: 'These merchants are not verified', appearance: 'warning' };
      default:
        return { icon: '@tui.shield-user', tooltip: 'Merchant Verification Status', appearance: '' };
    }
  }

  get genders() {
    const value = this.form.controls.gender.value;

    switch (value) {
      case 'Male':
        return { icon: '@tui.mars', tooltip: 'Hang on There G', appearance: 'positive' };
      case 'Female':
        return { icon: '@tui.venus', tooltip: 'Hello Venus', appearance: 'accent' };
      case 'Other':
        return { icon: '@tui.non-binary', tooltip: 'Happy Alphabet day', appearance: '' };
      default:
        return { icon: '@tui.circle-small', tooltip: 'Gender', appearance: '' };
    }
  }

  getSelectedFilters(): ListingFilters {
    return {
      houseTypes: this.form.controls.select.value ||[], // string[]
      gender: this.form.controls.gender.value||undefined,    // string
      verified: this.form.controls.verified.value||undefined // string
    };
  }
  submitSearch() {
    const filters = this.getSelectedFilters(); // typed as ListingFilters
    this.loading = true;
    this.housingService.getListingsByFilters(filters).subscribe({
      next: (res) => {
        const listings = res.map(listing => ({
          ...listing,
          created_at: listing.created_at ? new Date(listing.created_at + 'Z') : null
        }));
        this.filteredListings=listings
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      }
    });
  }



}
