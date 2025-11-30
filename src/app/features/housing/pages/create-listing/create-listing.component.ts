import { ChangeDetectionStrategy, Component, inject, NgZone, OnInit, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule, ValidatorFn, AbstractControl,ValidationErrors } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe, CommonModule, KeyValuePipe } from '@angular/common';

import { TuiTextfield, TuiNotification, TuiAlertService, TuiButton, TuiError, TuiTitle, TuiAppearance, TuiLoader, TuiGroup, TuiAutoColorPipe, TuiHint, TuiIcon, tuiAppearanceMode, tuiAppearanceFocus, tuiAppearanceState, tuiLoaderOptionsProvider } from '@taiga-ui/core';
import { TuiFieldErrorPipe, TuiFileLike, TuiFile, TuiFiles, TuiTextarea, TuiStepper, TuiSlides, TuiBlock, TuiRadio, TuiChip, TuiItemsWithMore, TuiInputNumber, TUI_COUNTRIES, TuiInputChip, TuiToastService, TuiTextareaLimit, TuiInputRange, TuiChevron, TuiBadge, TuiBadgedContent, TuiBadgeNotification } from '@taiga-ui/kit';
import { TuiCardLarge, TuiForm, TuiHeader, TuiItemGroup, TuiCardCollapsed, TuiCard } from '@taiga-ui/layout';
import {type TuiCountryIsoCode} from '@taiga-ui/i18n';
import { HousingService } from '../../services/housing.service';
import { forkJoin, Observable, of, Subject, timer } from 'rxjs';
import { map, switchMap, finalize, max } from 'rxjs/operators';
import { ImageUploadComponent } from '../../../../shared/ui/image-upload/image-upload.component';
import { ɵɵDir } from "@angular/cdk/scrolling";
import { TuiAutoFocus, TuiActiveZone, TuiItem,  } from '@taiga-ui/cdk';
import {TuiAmountPipe, TuiCurrencyPipe} from '@taiga-ui/addon-commerce';
import { TuiExpand } from '@taiga-ui/experimental';
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
    TuiAutoColorPipe,
    TuiCurrencyPipe,
    TuiInputNumber,
    TuiAmountPipe,
    TuiInputChip,
    TuiTextfield,
    TuiHint,
    TuiIcon,
    TuiTextareaLimit,
    TuiInputRange,
    TuiCardCollapsed,
    TuiCard,
    TuiExpand,
    TuiChevron,
    TuiLoader,
    TuiBadge,
    TuiBadgedContent,
    TuiBadgeNotification,
],
providers: [
  tuiLoaderOptionsProvider({
      size: 'l',
      inheritColor: false,
      overlay: true,
  }),
],
})
export class CreateListingComponent implements OnInit{
  public time!:number;
  private readonly alerts = inject(TuiAlertService);
  private readonly housingService = inject(HousingService);
  private readonly router = inject(Router);
  private readonly zone = inject(NgZone);
  protected readonly countryCode:TuiCountryIsoCode='KE'
  private readonly toast=inject(TuiToastService)
  public readonly collapsed=signal(false)
  protected loading = false;
  errorMsg = '';
  protected index=0;
  protected direction=0
  protected linesLimit=1;
  protected checked=[false]
  protected readonly step = 1;
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

  readonly block=[
    'Student',
    'Caretaker',
    'Landlord',
    'House Agent'
  ]

  amenityList=[
    'Running water',
    'Electricity',
    '24/7 Security'
  ]


  protected lastIndex = Infinity;
  protected getRemaining(index: number): number {
      const offset = index + 1;
      return this.chips.length - offset;
  }


  readonly form = new FormGroup({
    userType: new FormControl('',Validators.required),
    customHouseType:new FormControl('',Validators.maxLength(9)),
    houseType: new FormControl('',Validators.required),
    amenities:new FormControl<string[]>(this.amenityList,[Validators.required]),
    nearbySchools:new FormControl<string[]>([]),
    currentOccupants:new FormControl<number|null>(null,[Validators.required,Validators.min(1)]),
    maxOccupants:new FormControl<number | null>(null,[Validators.required,Validators.min(0)]),
    nearbyHospitals:new FormControl<string[]>([]),
    nearbyPoliceStations:new FormControl<string[]>([]),
    title: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    description: new FormControl('', [Validators.required, Validators.maxLength(1000)]),
    additionalNote: new FormControl('', [Validators.maxLength(100)]),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    city: new FormControl('', Validators.required),
    images: new FormControl<File[]>([], Validators.required),
  });

  get imagesControl(): FormControl<File[]> {
    return this.form.controls['images'] as FormControl<File[]>;
  }

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
    // validating chip length
    this.form.controls.amenities.setValidators(this.chipLengthValidator())
    this.form.controls.amenities.updateValueAndValidity()

    // don't allow non students to post shred listing
    this.form.controls.maxOccupants.setValidators(this.allowRoomSharingOptionValidator())
    this.form.controls.currentOccupants.setValidators(this.allowRoomSharingOptionValidator())
    this.form.controls.maxOccupants.updateValueAndValidity()
    this.form.controls.currentOccupants.updateValueAndValidity()

    // reset values of max and current occupants when one switches back to student
    this.form.controls.userType.valueChanges.subscribe((value) => {
      const currentControl = this.form.controls['currentOccupants'];
      const maxControl=this.form.controls['maxOccupants'];
      if (value === 'Student') {
        currentControl.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(10),

        ])
        maxControl.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(10),

        ]);
      } else {
        currentControl.setValidators([
          Validators.min(1),
          Validators.max(10),

        ])
        maxControl.setValidators([
          Validators.min(1),
          Validators.max(10),

        ]);
        this.form.controls.maxOccupants.reset()
        this.form.controls.currentOccupants.reset()
      }

      currentControl.updateValueAndValidity();
    });

     // reset customHouseType when a user switches back to chips
     this.form.controls.houseType.valueChanges.subscribe((value)=>{
      if(value!==this.chips[this.chips.length-1]){
        // clear customHouseType and its errors
        this.form.controls.customHouseType.reset()
      }
    })

    window.scrollTo({ top: 2, behavior: 'smooth' });

  }

  // chip length validator
  chipLengthValidator():ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
      const value:any= control.value as string[] | null;
      if (value.length > 8) {
        return { error: 'Entries cannot exceed 8' };
      }

      for (const chip of value) {
        if (chip.length > 20) {
          return { error: 'Values cannot exceed 15 characters' };
        }
      }

      return null; // valid
    };
  }

  customHouseTypeValidator():ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const houseType = this.form.controls.houseType.value;
      const customHouse = this.form.controls['customHouseType']?.value;
      if (houseType === this.chips[this.chips.length - 1] && !this.form.controls.customHouseType.value) {
        return { required: true }; // marks error
      }
      if(customHouse && customHouse.length>16){
        return { error: 'Value cannot exeed 16 characters' };
      }
      return null; // valid
    };
  }

  allowRoomSharingOptionValidator():ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const user_type = this.form.controls.userType.value;
      if (user_type!== "Student" && control.value>1) {
        return { roomSharingNotAllowed: true }; // marks error
      }
      return null; // valid
    };
  }




  submit(): void {
    if (this.form.invalid) return;
    this.time=Date.now()
    this.loading = true;
    this.errorMsg = '';

    const f = this.form.value;
    const fd = new FormData();

    // required fields
    fd.append('title', f.title ?? '');
    fd.append('description', f.description ?? '');
    fd.append('price', (f.price ?? 0).toString());
    fd.append('location', f.city ?? '');
    fd.append('user_type', f.userType ?? '');
    fd.append('house_type', f.houseType ?? '');
    fd.append('custom_house_type', f.customHouseType ?? '');
    fd.append('amenities', (f.amenities ?? []).join(','));

    // numeric/optional fields
    fd.append('current_occupants', (f.currentOccupants ?? 0).toString());
    fd.append('max_occupants', (f.maxOccupants ?? 0).toString());
    fd.append('nearby_schools', (f.nearbySchools ?? []).join(','));
    fd.append('nearby_hospitals', (f.nearbyHospitals ?? []).join(','));
    fd.append('nearby_police_stations', (f.nearbyPoliceStations ?? []).join(','));
    fd.append('additional_note', f.additionalNote ?? '');

    // image upload
    const images: TuiFileLike[] = f.images ?? [];
    for (const file of images) {
      let actualFile: File | null = null;

      if (!file) continue;

      // Taiga wrapped file
      if ('file' in file && file.file instanceof File) {
        actualFile = file.file;
      }
      // Native File
      else if (file instanceof File) {
        actualFile = file;
      }

      if (actualFile) {
        fd.append('images', actualFile, actualFile.name);
      }
    }
    window.scrollTo({ top: 2, behavior: 'smooth' });

    this.housingService.createListing(fd).subscribe({
      next: () => {
        this.loading = false;
        // this.form.reset({ images: [] });
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
          err?.error?.error ?? 'Failed to create listing. Please try again';
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
