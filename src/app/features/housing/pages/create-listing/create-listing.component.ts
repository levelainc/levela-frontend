import { AsyncPipe, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  NgZone,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {
  TuiTextfield,
  TuiNotification,
  TuiAlertService,
  TuiButton,
  TuiError,
  TuiTitle,
} from '@taiga-ui/core';
import {
  TuiFieldErrorPipe,
  TuiFile,
  TuiFileLike,
  TuiFileRejectedPipe,
  TuiFiles,
} from '@taiga-ui/kit';
import {
  TuiCardLarge,
  TuiForm,
  TuiHeader,
} from '@taiga-ui/layout';

import { HousingService } from '../../services/housing.service';
import { Observable, Subject, of, timer, forkJoin } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';
import { ImageUploadComponent } from '../../../../shared/ui/image-upload/image-upload.component';

@Component({
  standalone: true,
  selector: 'app-create-listing',
  templateUrl: './create-listing.component.html',
  styleUrl: './create-listing.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    AsyncPipe,
    ReactiveFormsModule,
    RouterLink,
    // Taiga UI modules
    TuiTextfield,
    TuiButton,
    TuiError,
    TuiFieldErrorPipe,
    TuiNotification,
    TuiTitle,
    TuiFile,
    TuiFiles,
    TuiCardLarge,
    TuiForm,
    TuiHeader,
    TuiFileRejectedPipe,
    ImageUploadComponent
  ],
})
export class CreateListingComponent {
  readonly alerts = inject(TuiAlertService);
  private readonly housingService = inject(HousingService);
  private readonly router = inject(Router);
  private readonly zone = inject(NgZone);

  readonly form = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    description: new FormControl('', [Validators.required, Validators.maxLength(1000)]),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    city: new FormControl('', Validators.required),
    images: new FormControl<TuiFileLike[] | null>(null, Validators.required),
  });

  readonly failedFiles$ = new Subject<TuiFileLike | null>();
  readonly loadingFiles$ = new Subject<TuiFileLike | null>();
  readonly loadedFiles$: Observable<TuiFileLike[] | null> = this.form.controls['images'].valueChanges.pipe(
    switchMap((files) => this.processFiles(files))
  );

  loading = false;
  errorMsg = '';

  removeFile(): void {
    this.form.controls['images'].setValue(null);
  }

  private processFiles(files: TuiFileLike[] | null): Observable<TuiFileLike[] | null> {
    this.failedFiles$.next(null);

    if (!files?.length || this.form.controls['images'].invalid) {
      return of(null);
    }

    const tasks = files.map((file) =>
      timer(500).pipe(
        map(() => {
          if (Math.random() > 0.2) return file;
          this.failedFiles$.next(file);
          return null;
        })
      )
    );

    this.loadingFiles$.next(files[0]);

    return forkJoin(tasks).pipe(
      map((results) => results.filter((f): f is TuiFileLike => f !== null)),
      finalize(() => this.loadingFiles$.next(null))
    );
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.errorMsg = '';

    const formData = new FormData();
    const { title, description, price, city, images } = this.form.value;

    formData.append('title', title ?? '');
    formData.append('description', description ?? '');
    formData.append('price', String(price ?? 0));
    formData.append('city', city ?? '');

    for (const file of images ?? []) {
      if (file instanceof File) {
        formData.append('images', file);
      }
    }

    this.housingService.createListing(formData).subscribe({
      next: () => {
        this.loading = false;
        this.alerts
          .open('Listing created successfully!', {
            label: 'Success',
            appearance: 'positive',
            autoClose: 3000,
          })
          .subscribe();

        this.zone.run(() => this.router.navigate(['/housing']));
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg =
          err?.error?.message ?? 'Failed to create listing. Please try again.';
        this.alerts
          .open(this.errorMsg, {
            label: 'Error',
            appearance: 'negative',
            autoClose: 5000,
          })
          .subscribe();
      },
    });
  }
}
