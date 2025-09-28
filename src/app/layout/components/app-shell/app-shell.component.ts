import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';
import {TuiNavigation} from '@taiga-ui/layout';

import { InfosectionComponent } from '../../../shared/ui/infosection/infosection.component';

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
    InfosectionComponent
  ],
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.less'],
})
export class AppShellComponent {
  protected current='basic'
}
