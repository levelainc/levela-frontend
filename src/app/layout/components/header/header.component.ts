import { ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TUI_DEFAULT_MATCHER} from '@taiga-ui/cdk';
import {TuiAvatar, TuiChevron} from '@taiga-ui/kit';
import {TuiCell, TuiInputSearch, TuiNavigation} from '@taiga-ui/layout';
import {TuiSearchHistory, TuiSearchResults} from '@taiga-ui/experimental';

// search
interface Result {
  href: string;
  title: string;
  subtitle?: string;
  icon?: string;
}

const DATA: Record<string, readonly Result[]> = {
  Documents: [
      {
          title: 'Monty Python',
          href: 'https://en.wikipedia.org/wiki/Monty_Python',
      },
  ],
  Code: [
      {
          title: 'Taiga UI',
          href: 'https://github.com/taiga-family/taiga-ui',
          icon: '@tui.github',
      },
      {
          title: 'Maskito',
          href: 'https://github.com/taiga-family/maskito',
          icon: '@tui.github',
      },
      {
          title: 'Taiga UI Proprietary',
          href: 'https://super-secret-evil.org/taiga-ui',
          icon: '@tui.gitlab',
      },
  ],
  Links: [
      {
          title: 'Taiga UI',
          subtitle: 'Super awesome library',
          href: 'https://taiga-ui.dev',
          icon: '/assets/images/taiga.svg',
      },
      {
          title: 'Maskito',
          href: 'https://maskito.dev',
          icon: '@tui.external-link',
      },
  ],
};
// #search
import {
  TuiAppearance,
  TuiButton,
  TuiDataList,
  TuiDropdown,
  TuiDropdownOpen,
  TuiDropdownService,
  TuiHint,
  TuiIcon,
  TuiOption,
  TuiTitle,
  TuiTextfield,
  TUI_DARK_MODE,
  TUI_DARK_MODE_KEY
} from '@taiga-ui/core';
import { filter, map, startWith, switchMap, timer } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-header',
  imports: [
    TuiNavigation,
    TuiAppearance,
    TuiButton,
    TuiDataList,
    TuiDropdown,
    TuiIcon,
    TuiTitle,
    TuiOption,
    TuiAvatar,
    TuiHint,
    TuiDropdownOpen,
    ReactiveFormsModule,
    TuiTextfield,
    TuiChevron,
    AsyncPipe,
    TuiCell,
    TuiInputSearch,
    TuiSearchResults,
    TuiSearchHistory,
    RouterLink,
    TuiDataList
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  constructor(private router: Router) {}
  // dark mode
  protected readonly darkMode = inject(TUI_DARK_MODE);
  protected readonly icon = computed(() =>
      this.darkMode() ? '@tui.sun' : '@tui.moon',
  );

  protected open = false;
  protected openDrawer=false;
  expanded=signal(true)
  // search
  protected readonly control = new FormControl('');

  protected readonly results$ = this.control.valueChanges.pipe(
      filter(Boolean),
      switchMap((value: string) =>
          timer(2000).pipe(
              map(() => this.filter(value)),
              startWith(null),
          ),
      ),
  );

  protected readonly popular = ['Taiga UI', 'Maskito', 'Web APIs for Angular'];

  private filter(query: string): Record<string, readonly Result[]> {
      return Object.entries(DATA).reduce(
          (result, [key, value]) => ({
              ...result,
              [key]: value.filter(({title, href, subtitle = ''}) =>
                  TUI_DEFAULT_MATCHER(title + href + subtitle, query),
              ),
          }),
          {},
      );
  }
  //# search
  logout(): void {
    // Clear tokens
    localStorage.clear();
    // Redirect to login
    this.router.navigate(['/auth/login']);
  }
}
