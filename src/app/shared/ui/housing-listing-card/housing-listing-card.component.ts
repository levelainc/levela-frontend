import {AsyncPipe} from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    inject,
    Input,
    Output,
} from '@angular/core';
export interface ListingCell {
  title?: string;
  more?: string;
  icon?: any;
  background?:string;
  color?:string;
  price?:number | string;
};
import { Title } from '@angular/platform-browser';
import { TuiAmountPipe } from '@taiga-ui/addon-commerce';
import {tuiIsString} from '@taiga-ui/cdk/utils/miscellaneous';
import { TuiIcon, TuiTitle } from '@taiga-ui/core';
import {TuiButton, tuiButtonOptionsProvider} from '@taiga-ui/core/components/button';
import {TuiFormatDatePipe} from '@taiga-ui/core/pipes/format-date';
import {TUI_CLOSE_WORD, TUI_COMMON_ICONS} from '@taiga-ui/core/tokens';
import { TuiCell } from '@taiga-ui/layout';
@Component({
  selector: 'app-housing-listing-card',
  imports: [
    TuiButton,
    TuiFormatDatePipe,
    AsyncPipe,
    TuiCell,
    TuiTitle,
    TuiAmountPipe,
    TuiIcon
],
  templateUrl: './housing-listing-card.component.html',
  styleUrl: './housing-listing-card.component.less',
  providers: [tuiButtonOptionsProvider({size: 's', appearance: 'secondary'})],
    host: {
        '[style.--t-lines]': 'lines',
    },
})
export class HousingListingCardComponent {
  protected readonly isString = tuiIsString;
    protected readonly closeWord = inject(TUI_CLOSE_WORD);
    protected readonly icons = inject(TUI_COMMON_ICONS);

    @Input()
    public heading = '';

    @Input()
    public lines = 2;

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



    // @Output()
    // public readonly close = new EventEmitter<void>();
}
