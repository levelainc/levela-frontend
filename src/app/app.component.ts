import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppShellComponent } from "./layout/components/app-shell/app-shell.component";
import { TuiRoot,TUI_DARK_MODE, TUI_DARK_MODE_KEY, TuiButton,TuiAppearance } from '@taiga-ui/core';

@Component({
  selector: 'app-root',
  imports: [
    TuiRoot,
    AppShellComponent,
    TuiAppearance,
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  title = 'levela-frontend';
  protected readonly darkMode = inject(TUI_DARK_MODE);
}
