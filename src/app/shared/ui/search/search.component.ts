import { Component, inject, OnInit,ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiAppearance, TuiButton, TuiDataList, TuiIcon, TuiLabel, TuiLoader, TuiOptGroup, TuiOption, TuiSelectLike, TuiTextfield, TuiTextfieldDropdownDirective, TuiWithTextfieldDropdown } from '@taiga-ui/core';
import {
  TuiFilter,
  TuiSegmented,
  TuiSkeleton,
  TuiSwitch,
  TuiChevron,
  TuiDataListWrapper,
  TuiFilterByInputPipe,
  TuiHideSelectedPipe,
  TuiInputChip,
  TuiMultiSelect,
  TuiMultiSelectGroupDirective,
  TuiMultiSelectGroupComponent,
  TuiSelect,
  TuiTooltip,
   } from '@taiga-ui/kit';
  import {tuiIsString, TuiItem, TuiPlatform, type TuiIdentityMatcher,type TuiBooleanHandler} from '@taiga-ui/cdk';
import { TuiForm, TuiSearch } from '@taiga-ui/layout';
import { HousingService } from '../../../features/housing/services/housing.service';
import {type TuiStringMatcher} from '@taiga-ui/cdk';
import { TuiDropdownMobile } from '@taiga-ui/addon-mobile';
const ROMAN_TO_LATIN: Record<string, string> = {
  I: '1',
  II: '2',
  III: '3',
  IV: '4',
  V: '5',
  VI: '6',
  VII: '7',
  VIII: '8',
};
interface User {
  readonly name: string;
  readonly index: number;
}
@Component({
  selector: 'app-search',
  imports: [
    TuiForm,
    TuiTextfield,
    TuiSearch,
    TuiIcon,
    ReactiveFormsModule,
    TuiSegmented,
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
    TuiTooltip
],
  templateUrl: './search.component.html',
  styleUrl: './search.component.less',
})
export class SearchComponent implements OnInit{
  private readonly housingService=inject(HousingService)
  topFilters: string[] = [];
  protected loading=true

  protected readonly gender=['Male','Female','Other'] as const;
  protected readonly verified=['Verified','Unverified'] as const;

  ngOnInit(): void {
    this.housingService.getTopFilters().subscribe(filters => {
      this.topFilters = filters;
      if(filters.length) this.loading=false
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
        return { icon: '@tui.users', tooltip: 'Happy Alphabet day', appearance: 'warning' };
      default:
        return { icon: '@tui.shield-user', tooltip: 'Gender', appearance: '' };
    }
  }

}
