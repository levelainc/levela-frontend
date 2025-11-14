import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TuiNotification ,TuiLoader, TuiButton, TuiIcon} from '@taiga-ui/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.less'],
  imports: [TuiNotification, TuiLoader]
})
export class EmailVerificationComponent implements OnInit {
  loading = true;
  success = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      // No token? just display "check your email" info
      this.loading = false;
      this.success = false;
      this.error = null
      return;
    }

    this.authService.verifyEmail(token).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Verification failed.';
        this.loading = false;
      },
    });
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
