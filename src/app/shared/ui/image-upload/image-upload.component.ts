import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  TuiFile,
  TuiFiles,
  TuiFileLike,
  tuiFilesRejected,
} from '@taiga-ui/kit';
import {
  AsyncPipe,
  NgIf,
  NgForOf,
  CommonModule,
} from '@angular/common';
import {
  Subject,
  of,
  timer,
  forkJoin,
  Observable,
} from 'rxjs';
import {
  finalize,
  map,
  switchMap,
} from 'rxjs/operators';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    AsyncPipe,
    TuiFiles,
    TuiFile,
  ],
})
export class ImageUploadComponent implements OnInit {
  @Input({ required: true }) control!: FormControl<TuiFileLike[] | null>;
  @Input() accept: string = 'image/*';
  @Input() multiple: boolean = true;
  @Input() label: string = 'Upload files';

  readonly failedFiles$ = new Subject<TuiFileLike[]>();
  readonly loadingFiles$ = new Subject<TuiFileLike[]>();
  readonly loadedFiles$: Observable<TuiFileLike[]> = this.control.valueChanges.pipe(
    switchMap((files) => this.processFiles(files))
  );

  ngOnInit(): void {
    if (!this.control) {
      throw new Error('FormControl is required for app-image-upload');
    }
  }

  get rejectedFiles(): TuiFileLike[] {
    const acceptedTypes = this.accept.split(',').map(type => type.trim());

    return (this.control.value || []).filter(file => {
      if (!file || typeof file === 'string') return true; // skip invalids
      return !acceptedTypes.some(type =>
        file.type?.includes(type.replace('*', ''))
      );
    });
  }


  removeFile(): void {
    this.control.setValue(null);
  }

  private processFiles(files: TuiFileLike[] | null): Observable<TuiFileLike[]> {
    this.failedFiles$.next([]);

    if (!files?.length) return of([]);

    const tasks = files.map((file) =>
      timer(500).pipe(
        map(() => {
          const passed = Math.random() > 0.2;
          if (!passed) {
            this.failedFiles$.next([file]);
            return null;
          }
          return file;
        })
      )
    );

    this.loadingFiles$.next(files);

    return forkJoin(tasks).pipe(
      map((results) => results.filter((f): f is TuiFileLike => f !== null)),
      finalize(() => this.loadingFiles$.next([]))
    );
  }
}
