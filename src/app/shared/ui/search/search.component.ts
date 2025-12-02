import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiButton, TuiIcon, TuiLabel, TuiLoader, TuiTextfield } from '@taiga-ui/core';
import { TuiFilter, TuiSegmented, TuiSkeleton, TuiSwitch } from '@taiga-ui/kit';
import { TuiForm, TuiSearch } from '@taiga-ui/layout';
import { HousingService } from '../../../features/housing/services/housing.service';

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
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.less',
})
export class SearchComponent implements OnInit{
  private readonly housingService=inject(HousingService)
  topFilters: string[] = [];
  protected loading=true
  items=['cdfd','rgdfgdg','dhggdhd']
  ngOnInit(): void {
    this.housingService.getTopFilters().subscribe(filters => {
      this.topFilters = filters;
      if(filters.length) this.loading=false
    });
  }

  readonly form=new FormGroup({

  })
}
