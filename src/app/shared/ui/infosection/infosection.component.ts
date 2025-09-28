import { Component } from '@angular/core';
import { TuiItem } from '@taiga-ui/cdk';
import { TuiAppearance, TuiButton, TuiIcon, TuiNotification } from '@taiga-ui/core';
import { TuiBadge, TuiCarousel, TuiPagination, TuiTile } from '@taiga-ui/kit';
import { TuiCardLarge, TuiCardMedium, TuiCell } from '@taiga-ui/layout';

@Component({
  selector: 'app-infosection',
  imports: [
    TuiBadge,
    TuiCarousel,
    TuiIcon,
    TuiPagination,
    TuiCardLarge,
    TuiButton,
    TuiCell,
    TuiTile,
    TuiAppearance,
    TuiItem,
    TuiNotification,
    TuiCardMedium
  ],
  templateUrl: './infosection.component.html',
  styleUrl: './infosection.component.less'
})
export class InfosectionComponent {
  protected index=0;
  protected count=3;
  activeIndex=0;
}
