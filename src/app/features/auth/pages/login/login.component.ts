import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {
    TuiAppearance,
    TuiButton,
    TuiError,
    TuiNotification,
    TuiTextfield,
    TuiTitle,
} from '@taiga-ui/core';
import {TuiFieldErrorPipe} from '@taiga-ui/kit';
import {TuiCardLarge, TuiForm, TuiHeader} from '@taiga-ui/layout';


@Component({
  imports: [
      AsyncPipe,
      ReactiveFormsModule,
      TuiAppearance,
      TuiButton,
      TuiCardLarge,
      TuiError,
      TuiFieldErrorPipe,
      TuiForm,
      TuiHeader,
      TuiNotification,
      TuiTextfield,
      TuiTitle,
  ],
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export  class LoginComponent {
  readonly form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  constructor(private router: Router) {}

  login(): void {
    if (this.form.invalid) return;

    const { email, password } = this.form.value;


    this.router.navigate(['/dashboard']);
  }
}
