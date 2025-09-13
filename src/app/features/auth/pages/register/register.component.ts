import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  TuiAppearance,
  TuiButton,
  TuiError,
  TuiIcon,
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
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    TuiIcon
  ],
})
export class RegisterComponent {
  readonly form = new FormGroup({
    full_name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    confirm_password: new FormControl('', Validators.required),
  });
  private readonly alerts = inject(TuiAlertService);
  constructor(private auth: AuthService, private router: Router) {}
  register(): void {
    if (this.form.invalid) return;

    const full_name = this.form.get('full_name')!.value as string;
    const email = this.form.get('email')!.value as string;
    const password = this.form.get('password')!.value as string;
    const confirm_password = this.form.get('confirm_password')!.value as string;

    if (password !== confirm_password) {
      this.alerts
            .open(
          '<strong>Passwords do not match</strong>',{
          label:'Error',
          appearance: 'negative',
          autoClose: 5000,})
            .subscribe();
      return;
    }

    const payload = { full_name, email, password };

    this.auth.register(payload).subscribe({
      next: (response) => {
        // elert
        this.alerts
            .open(response.message || 'Registration successful! Please check your email to verify your account.',{
          label:'Success',
          appearance: 'positive',
          autoClose: 6000,
        })
            .subscribe();
        this.router.navigate(['/auth/verify-email']);
      },
      error: (err) => {
        this.alerts
            .open('Registration failed.',{
          label:'Error',
          appearance: 'negative',
          autoClose: 5000,})
            .subscribe();
      }
    });
  }


}
