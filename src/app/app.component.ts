import { TuiAppearance, TuiRoot } from "@taiga-ui/core";
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppShellComponent } from "./layout/components/app-shell/app-shell.component";
import {WA_LOCAL_STORAGE, WA_WINDOW} from '@ng-web-apis/common';
import {TUI_DARK_MODE, TUI_DARK_MODE_KEY, TuiButton} from '@taiga-ui/core';
@Component({
  selector: 'app-root',
  imports: [
    TuiRoot,
    AppShellComponent,
    TuiAppearance,
      TuiRoot
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  protected readonly darkMode = inject(TUI_DARK_MODE);
  private readonly key = inject(TUI_DARK_MODE_KEY);
  private readonly storage = inject(WA_LOCAL_STORAGE);
  private readonly media = inject(WA_WINDOW).matchMedia('(prefers-color-scheme: dark)');
}
