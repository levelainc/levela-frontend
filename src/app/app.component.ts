import { TuiRoot } from "@taiga-ui/core";
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppShellComponent } from "./layout/components/app-shell/app-shell.component";

@Component({
  selector: 'app-root',
  imports: [
    TuiRoot,
    AppShellComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  title = 'levela-frontend';
}
