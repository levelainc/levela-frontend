import {TuiAsideComponent, TuiAsideGroupComponent, TuiNavigation} from '@taiga-ui/layout';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  TuiChevron,
  TuiFade
} from '@taiga-ui/kit';
import { TuiButton, TuiIcon } from '@taiga-ui/core';


@Component({
  selector: 'app-sidebar-content',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TuiChevron,
    TuiFade,
    TuiIcon,
    TuiAsideGroupComponent,
    TuiButton,
    TuiChevron,
    TuiNavigation
  ],
  templateUrl: './sidebar-content.component.html',
  styleUrls: ['./sidebar-content.component.less']
})
export class SidebarContentComponent {
  expanded=signal(true)
  isAdmin: boolean = false;

   toggle = new EventEmitter<void>();
  logoutClick = new EventEmitter<void>();
}

