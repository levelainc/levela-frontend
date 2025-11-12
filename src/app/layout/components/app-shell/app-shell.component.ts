import { Component } from '@angular/core';
import { CommonModule, } from '@angular/common';
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

@Component({
  selector: 'app-app-shell',
  standalone: true,
  imports: [
    CommonModule,
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
    TuiHint
],
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.less'],
})
export class AppShellComponent {
  protected current='basic'
  readonly items = ['Apartment', 'Hostel', 'Bedsitter'];
  readonly filters = ['Balcony', 'Pet-friendly', 'Self-contained'];
  activeItemIndex=0;
  id?:Number
  showInfoSection=false;

  showHousingNav=false;
  constructor(private router:Router){
    this.router.events
    .pipe(filter(event=>event instanceof NavigationEnd))
    .subscribe((e: NavigationEnd)=>{
      this.showHousingNav=e.urlAfterRedirects.startsWith('/housing')
      this.showInfoSection=e.urlAfterRedirects.startsWith('/housing/')
    })
  }
}
