import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, NgZone } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {
  TuiAppearance,
  TuiButton,
  TuiError,
  TuiLink,
  TuiNotification,
  TuiTextfield,
  TuiTitle,
  TuiAlertService
} from '@taiga-ui/core';
import { TuiFieldErrorPipe } from '@taiga-ui/kit';
import { TuiCardLarge, TuiForm, TuiHeader } from '@taiga-ui/layout';
import { AuthService } from '../../../../core/services/auth.service';

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
    RouterLink,
    TuiLink,
  ],
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly alerts = inject(TuiAlertService);
  readonly form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  loading = false;
  errorMsg = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private zone: NgZone
  ) {}

  login(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.errorMsg = '';

    const email = this.form.get('email')?.value as string;
    const password = this.form.get('password')?.value as string;

    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        this.loading = false;
        const user = response.user;

        this.alerts.open('<strong>Welcome Back</strong>', {
          label: 'Success',
          appearance: 'positive',
          autoClose: 3000,
        }).subscribe(); // Optional;remove or wait before redirect

        //Wrap redirect logic inside zone
        this.zone.run(() => {
          if (!user?.is_verified) {
            this.router.navigate(['/auth/verify-email']);
          } else if (!user?.is_onboarded) {
            this.router.navigate(['/onboarding/type']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        });

      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Login failed. Please try again.';
        this.alerts.open(this.errorMsg, {
          label: 'Error',
          appearance: 'negative',
          autoClose: 5000,
        }).subscribe();
      },
    });
  }


}
