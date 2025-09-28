import { ChangeDetectionStrategy, Component, inject, NgZone } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf, AsyncPipe } from '@angular/common';

import { TuiTextfield, TuiNotification, TuiAlertService, TuiButton, TuiError, TuiTitle } from '@taiga-ui/core';
import { TuiFieldErrorPipe, TuiFileLike, TuiFile, TuiFiles, TuiTextarea } from '@taiga-ui/kit';
import { TuiCardLarge, TuiForm, TuiHeader } from '@taiga-ui/layout';

import { HousingService } from '../../services/housing.service';


import { forkJoin, Observable, of, Subject, timer } from 'rxjs';
import { map, switchMap, finalize } from 'rxjs/operators';
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
    ImageUploadComponent,
    TuiTextarea
  ],
})
export class CreateListingComponent {
  private readonly alerts = inject(TuiAlertService);
private readonly housingService = inject(HousingService);
private readonly router = inject(Router);
private readonly zone = inject(NgZone);

loading = false;
errorMsg = '';

readonly form = new FormGroup({
  title: new FormControl('', [Validators.required, Validators.maxLength(100)]),
  description: new FormControl('', [Validators.required, Validators.maxLength(1000)]),
  price: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
  city: new FormControl('', Validators.required),
  images: new FormControl<TuiFileLike[]>([]), // keep for UI
});

// Reactive streams for image upload
readonly failedFiles$ = new Subject<TuiFileLike[]>();
readonly loadingFiles$ = new Subject<TuiFileLike[]>();
readonly loadedFiles$: Observable<TuiFileLike[]> = this.form.controls['images'].valueChanges.pipe(
  switchMap((files) => this.processFiles(files))
);

removeFile(file?: TuiFileLike): void {
  if (!file) {
    this.form.controls['images'].setValue([]);
    return;
  }
  this.form.controls['images'].setValue(
    (this.form.controls['images'].value || []).filter(f => f !== file)
  );
}

private processFiles(files: TuiFileLike[] | null): Observable<TuiFileLike[]> {
  this.failedFiles$.next([]);
  if (!files?.length) return of([]);

  const tasks = files.map(file =>
    timer(500).pipe(
      map(() => {
        if (Math.random() > 0.2) return file;
        this.failedFiles$.next([file]);
        return null;
      })
    )
  );

  this.loadingFiles$.next(files);

  return forkJoin(tasks).pipe(
    map(results => results.filter((f): f is TuiFileLike => f !== null)),
    finalize(() => this.loadingFiles$.next([]))
  );
}

submit(): void {
  if (this.form.invalid) return;

  this.loading = true;
  this.errorMsg = '';

  const { title, description, price, city } = this.form.value;

  // payload as JSON object
  const payload = {
    title: title ?? '',
    description: description ?? '',
    price: price ?? 0,
    location: city ?? '',
  };

  this.housingService.createListing(payload).subscribe({
    next: () => {
      this.loading = false;
      this.form.reset({ images: [] });
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
