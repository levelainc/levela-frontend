import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TuiFiles, TuiFileLike } from '@taiga-ui/kit';
import {
  TuiLabel,
  TuiError,
  TuiButton,
  TuiTextfield,
} from '@taiga-ui/core';
import { TuiCardLarge, TuiForm, TuiHeader } from '@taiga-ui/layout';
import { Subscription, of, timer, Subject, switchMap, finalize, map, Observable } from 'rxjs';
import { OnboardingService } from '../services/onboarding.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-step-verification',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiFiles,
    TuiForm,
    TuiLabel,
    TuiError,
    TuiCardLarge,
    TuiButton,
    TuiHeader,
    TuiLabel,
    TuiTextfield
  ],
  templateUrl: './step-verification.component.html',
  styleUrls: ['./step-verification.component.less']
})
export class StepVerificationComponent implements OnInit, OnDestroy {
  private readonly onboardingService = inject(OnboardingService);
  private readonly router = inject(Router);
  private subs = new Subscription();

  form = new FormGroup({
    email: new FormControl<string | null>(null, [Validators.email]),
    file: new FormControl<TuiFileLike | null>(null), // not File[]!
  });

  fileControl = this.form.get('file') as FormControl<TuiFileLike | null>;

  // Optional feedback streams (fail, load, success)
  readonly failedFiles$ = new Subject<TuiFileLike | null>();
  readonly loadingFiles$ = new Subject<TuiFileLike | null>();
  readonly loadedFiles$ = this.form.get('file')!.valueChanges.pipe(
    switchMap((file) => this.processFile(file))
  );

  ngOnInit(): void {
    const saved = this.onboardingService.getStepData('verification');
    if (saved) {
      this.form.patchValue({
        email: saved.email || '',
        file: saved.file || null,
      });
    }
  }

  processFile(file: TuiFileLike | null): Observable<TuiFileLike | null> {
    this.failedFiles$.next(null);

    if (!file) return of(null);

    this.loadingFiles$.next(file);

    return timer(1000).pipe(
      map(() => {
        if (Math.random() > 0.1) return file; // Simulate success
        this.failedFiles$.next(file);
        return null;
      }),
      finalize(() => this.loadingFiles$.next(null))
    );
  }

  removeFile(): void {
    this.fileControl.setValue(null);
  }




  goNext(): void {
    const email = this.form.value.email ?? undefined;
    const file = this.form.value.file ?? null;
    if (!email && !file) {
      this.form.markAllAsTouched();
      return;
    }



this.onboardingService
  .saveVerificationToBackend({ email, file })
  .subscribe({
    next: () => {
      this.onboardingService.setStepData('verification', { email, file });
      this.router.navigate(['/onboarding/success']);
    },
    error: (err) => {
      console.error('Failed to save verification:', err);
    },
  });

  }


  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
