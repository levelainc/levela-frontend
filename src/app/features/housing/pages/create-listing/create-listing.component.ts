import { ChangeDetectionStrategy, Component, inject, NgZone, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule, ValidatorFn, AbstractControl,ValidationErrors } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe, CommonModule, KeyValuePipe, NgFor } from '@angular/common';

import { TuiTextfield, TuiNotification, TuiAlertService, TuiButton, TuiError, TuiTitle, TuiAppearance, TuiLoader, TuiGroup, TuiAutoColorPipe } from '@taiga-ui/core';
import { TuiFieldErrorPipe, TuiFileLike, TuiFile, TuiFiles, TuiTextarea, TuiStepper, TuiSlides, TuiBlock, TuiRadio, TuiChip, TuiItemsWithMore } from '@taiga-ui/kit';
import { TuiCardLarge, TuiForm, TuiHeader, TuiItemGroup } from '@taiga-ui/layout';

import { HousingService } from '../../services/housing.service';

import { forkJoin, Observable, of, Subject, timer } from 'rxjs';
import { map, switchMap, finalize } from 'rxjs/operators';
import { ImageUploadComponent } from '../../../../shared/ui/image-upload/image-upload.component';
import { ɵɵDir } from "@angular/cdk/scrolling";
import { TuiAutoFocus, tuiMarkControlAsTouchedAndValidate, TuiActiveZone, TuiItem,  } from '@taiga-ui/cdk';

@Component({
  standalone: true,
  selector: 'app-create-listing',
  templateUrl: './create-listing.component.html',
  styleUrl: './create-listing.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
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
    TuiTextarea,
    TuiStepper,
    RouterLink,
    RouterLinkActive,
    ɵɵDir,
    TuiSlides,
    TuiAppearance,
    KeyValuePipe,
    TuiAutoFocus,
    CommonModule,
    TuiActiveZone,
    TuiGroup,
    TuiBlock,
    TuiRadio,
    FormsModule,
    TuiItemGroup,
    TuiChip,
    TuiItemsWithMore,
    TuiItem,
    TuiAutoColorPipe

],
})
export class CreateListingComponent implements OnInit{
  private readonly alerts = inject(TuiAlertService);
  private readonly housingService = inject(HousingService);
  private readonly router = inject(Router);
  private readonly zone = inject(NgZone);

  loading = false;
  errorMsg = '';
  protected index=0;
  protected direction=0
  protected linesLimit=1;
  protected checked=[false]
  protected readonly chips=[
    'Single Room',
    'Double Room',
    'Bed Sitter',
    'Studio apartment',
    '1 Bedroom',
    '2 Bedrooms',
    '3 Bedrooms',
    '4 Bedrooms',
    '5 Bedrooms',
    '6+ Bedrooms',
    'Other'
  ]

  protected lastIndex = Infinity;
  protected getRemaining(index: number): number {
      const offset = index + 1;

      return this.chips.length - offset;
  }

  readonly form = new FormGroup({
    userType: new FormControl('',Validators.required),
    customHouseType:new FormControl(''),
    houseType: new FormControl('',Validators.required),
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


  // custom validation
  ngOnInit(): void {
    this.form.controls.customHouseType.setValidators(this.customHouseTypeValidator());
    this.form.controls.customHouseType.updateValueAndValidity();
  }

  customHouseTypeValidator():ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const houseType = this.form.controls.houseType.value;
      if (houseType === this.chips[this.chips.length - 1] && !this.form.controls.customHouseType.value) {
        this.alerts
          .open('Add a house type', {
            label: 'Error',
            appearance: 'negative',
            autoClose: 3000,
          })
          .subscribe();
        return { required: true }; // marks error
      }else

      if (houseType != this.chips[this.chips.length - 1]) {
        return { required: false }
      }

      return null; // valid
    };
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



//   protected readonly forms = [
//     new FormGroup({
//       title: new FormControl('', [Validators.required, Validators.maxLength(100)]),
//       description: new FormControl('', [Validators.required, Validators.maxLength(1000)]),
//       price: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
//       city: new FormControl('', Validators.required),
//       images: new FormControl<TuiFileLike[]>([]),
//     }),

//     new FormGroup({
//         Name: new FormControl('', Validators.required),
//         Surname: new FormControl('', Validators.required),
//     }),
//     new FormGroup({
//         Country: new FormControl('', Validators.required),
//         City: new FormControl('', Validators.required),
//         Address: new FormControl('', Validators.required),
//     }),
//     new FormGroup({
//         Card: new FormControl('', Validators.required),
//         Value: new FormControl('', Validators.required),
//     }),
// ];

// protected onStep(step: number): void {
//   this.direction = step - this.index;
//   this.index = step;
// }

// protected onSubmit(): void {
//   tuiMarkControlAsTouchedAndValidate(this.forms[this.index]!);

//   if (this.forms[this.index]?.invalid) {
//       return;
//   }

//   this.direction = 1;
//   this.index = Math.min(this.index + 1, this.forms.length - 1);
// }

value=0

}
