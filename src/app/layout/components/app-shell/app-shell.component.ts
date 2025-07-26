import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';
import {TuiNavigation, TuiSubheaderCompactComponent, TuiSubheaderComponent} from '@taiga-ui/layout';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SidebarContentComponent } from '../../../shared/ui/sidebar-content/sidebar-content.component';
import { TuiDrawer } from '@taiga-ui/kit';
import { TuiAppearance, TuiPopup } from '@taiga-ui/core';

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
    TuiSubheaderCompactComponent,
    TuiSubheaderComponent
  ],
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.less'],
})
export class AppShellComponent {

}
