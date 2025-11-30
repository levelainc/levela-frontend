import { Component } from '@angular/core';

import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';
import {TuiCell, TuiNavigation} from '@taiga-ui/layout';

import { InfosectionComponent } from '../../../shared/ui/infosection/infosection.component';
import { filter } from 'rxjs';
import {TuiButton, TuiHint, TuiIcon, TuiTitle } from "@taiga-ui/core";
import {  TuiTab, TuiTabsWithMore } from '@taiga-ui/kit';
import { TuiItem } from '@taiga-ui/cdk';
import { HousingNavComponent } from '../../../shared/ui/housing-nav/housing-nav.component';

@Component({
  selector: 'app-app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    FooterComponent,
    HeaderComponent,
    TuiNavigation,
    InfosectionComponent,
    RouterLink,
    TuiTabsWithMore,
    TuiItem,
    TuiTab,
    TuiCell,
    TuiTitle,
    TuiIcon,
    TuiButton,
    TuiHint,
    HousingNavComponent
],
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.less'],
})
export class AppShellComponent {
  showInfoSection=false;
  showHousingNav=false;
  showCreateListingNav=false
  constructor(private router:Router){
    this.router.events
    .pipe(filter(event=>event instanceof NavigationEnd))
    .subscribe((e: NavigationEnd)=>{
      this.showHousingNav=e.urlAfterRedirects.startsWith('/housing')
      this.showInfoSection=e.urlAfterRedirects.startsWith('/housing/')
      this.showCreateListingNav=e.urlAfterRedirects.startsWith('/housing/create')
    })
  }
}
