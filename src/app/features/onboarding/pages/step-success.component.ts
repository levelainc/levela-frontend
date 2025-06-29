import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TuiButton, TuiNotification, TuiTitle } from '@taiga-ui/core';
import { Subscription, timer } from 'rxjs';
import { TuiProgress } from '@taiga-ui/kit';
import { OnboardingService } from '../services/onboarding.service';

@Component({
  selector: 'app-step-success',
  standalone: true,
  imports: [
    CommonModule,
    TuiButton,
    TuiProgress,
    TuiNotification,
    TuiTitle,
  ],
  templateUrl: './step-success.component.html',
  styleUrls: ['./step-success.component.less'],
})
export class StepSuccessComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly onboardingService = inject(OnboardingService);
  private readonly subs = new Subscription();

  loaderValue = 0;

  ngOnInit(): void {
    // Mark onboarding as complete in backend
    this.onboardingService.markUserAsOnboarded().subscribe({
      next: () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.is_onboarded = true;
        localStorage.setItem('user', JSON.stringify(user));
      },
      error: (err) => {
        console.error('Failed to finalize onboarding', err);
      },
    });

    // Animate loader and redirect after 10s
    const interval$ = timer(0, 1000).subscribe((count) => {
      this.loaderValue = (count + 1) / 10;
      if (count === 10) {
        this.router.navigate(['/dashboard']);
      }
    });

    this.subs.add(interval$);
  }

  skipWait(): void {
    this.router.navigate(['/dashboard']);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
