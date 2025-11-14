import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription, Subject, Observable, timer, of, switchMap, map, finalize } from 'rxjs';
import { OnboardingService } from '../services/onboarding.service';
import { TuiAvatar, TuiTextarea, TuiTextareaLimit, TuiFileLike, TuiFiles, TuiFile } from '@taiga-ui/kit';
import { TuiButton, TuiError, TuiLabel, TuiTextfield } from '@taiga-ui/core';
import { TuiCardLarge, TuiForm, TuiHeader } from '@taiga-ui/layout';
import { AsyncPipe } from '@angular/common';
import { OnboardingUser } from '../services/onboarding.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-step-profile-details',
  standalone: true,
  templateUrl: './step-profile-details.component.html',
  styleUrls: ['./step-profile-details.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    TuiError,
    TuiForm,
    TuiCardLarge,
    TuiButton,
    TuiHeader,
    TuiLabel,
    TuiTextfield,
    ReactiveFormsModule,
    TuiTextarea,
    TuiFiles,
    TuiFile
]
})
export class StepProfileDetailsComponent implements OnInit, OnDestroy {
  readonly form = new FormGroup({
    phone: new FormControl('', Validators.pattern(/^\+?\d{7,15}$/)),
    bio: new FormControl('', Validators.maxLength(120)),
    avatar: new FormControl<TuiFileLike | null>(null),
  });

  readonly failedFiles$ = new Subject<TuiFileLike | null>();
  readonly loadingFiles$ = new Subject<TuiFileLike | null>();
  readonly loadedFiles$: Observable<TuiFileLike | null> = this.form.get('avatar')!.valueChanges.pipe(
    switchMap(file => this.processFile(file))
  );

  userInitials: string = '';
  private subs = new Subscription();

  constructor(
    private readonly onboardingService: OnboardingService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.onboardingService.user$.subscribe((user: OnboardingUser | null) => {
        const fullName = user?.fullName ?? '';
        this.userInitials = this.generateInitials(fullName);

        const saved = this.onboardingService.getStepData('profile-details');
        if (saved) {
          this.form.patchValue({
            phone: saved.phone || '',
            bio: saved.bio || '',
            avatar: null, // don’t preload avatar blob
          });
        }
      })
    );
  }

  generateInitials(fullName: string): string {
    return fullName
      .split(' ')
      .filter(Boolean)
      .map(n => n[0].toUpperCase())
      .slice(0, 2)
      .join('');
  }

  processFile(file: TuiFileLike | null): Observable<TuiFileLike | null> {
    this.failedFiles$.next(null);
    if (this.form.get('avatar')?.invalid || !file) return of(null);

    this.loadingFiles$.next(file);

    return timer(1000).pipe(
      map(() => {
        // Simulate file validation success
        const success = true;
        if (success) return file;

        this.failedFiles$.next(file);
        return null;
      }),
      finalize(() => this.loadingFiles$.next(null))
    );
  }

  removeFile(): void {
    this.form.get('avatar')?.setValue(null);
  }

  goNext(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { phone, bio, avatar } = this.form.value;

    // Convert file to base64 if provided
    const reader = new FileReader();
    if (avatar) {
      reader.onload = () => {
        this.saveToBackend(phone!, bio!, reader.result as string);
      };
      reader.readAsDataURL((avatar as File) as Blob);
    } else {
      this.saveToBackend(phone!, bio!, null);
    }
  }

  private saveToBackend(phone: string, bio: string, avatarBase64: string | null): void {
    this.onboardingService.saveProfileToBackend({
      phone_number: phone,
      bio,
      profile_picture: avatarBase64,
    }).subscribe({
      next: () => {
        this.onboardingService.setStepData('profile-details', {
          phone,
          bio,
          avatar: avatarBase64,
        });
        this.router.navigate(['/onboarding/verify']);
      },
      error: err => {
        console.error('Profile save failed:', err);
      },
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  get avatarControl(): FormControl {
    return this.form.get('avatar') as FormControl;
  }

}
