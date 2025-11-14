
import {Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiAppearance, TuiDataList, TuiDropdown, TuiIcon } from '@taiga-ui/core';
import { TuiBadge, TuiChevron, TuiFade } from '@taiga-ui/kit';
import { TuiNavigation } from '@taiga-ui/layout';
import { SidebarContentComponent } from '../../../shared/ui/sidebar-content/sidebar-content.component';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    TuiNavigation,
    RouterLink,
    TuiDropdown,
    TuiDataList,
    TuiChevron,
    TuiAppearance
],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.less'
})
export class SidebarComponent {
  get isExpanded(): boolean {
    return this.expanded();
  }
  expanded = signal(false);
  logout() {}

  get isAdmin(): boolean {
    return true; // placeholder
  }
  protected handleToggle(): void {
    this.expanded.update((e) => !e);
}
}
