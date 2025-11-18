import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiFile, TuiFiles, TuiFileLike } from '@taiga-ui/kit';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Subject, Observable, of, forkJoin, timer } from 'rxjs';
import { switchMap, map, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AsyncPipe,
    TuiFiles,
    TuiFile
],
})
export class ImageUploadComponent implements OnInit {
  @Input() control!: FormControl<TuiFileLike[] | null>;
  @Input() accept: string = 'image/*';
  @Input() multiple: boolean = true;
  @Input() label: string = 'Upload files';

  readonly failedFiles$ = new Subject<TuiFileLike[] | null>();
  readonly loadingFiles$ = new Subject<TuiFileLike[] | null>();
  readonly loadedFiles$: Observable<TuiFileLike[]> = this.control?.valueChanges.pipe(
    switchMap(files => this.processFiles(files))
  ) ?? of([]);

  ngOnInit(): void {
    if (!this.control) {
      throw new Error('FormControl is required for app-image-upload');
    }
    // Initialize Subjects with empty array to avoid template async errors
    this.failedFiles$.next([]);
    this.loadingFiles$.next([]);
  }

  get rejectedFiles(): TuiFileLike[] {
    const acceptedTypes = this.accept.split(',').map(t => t.trim());
    return (this.control.value ?? []).filter(file => {
      if (!file || typeof file === 'string') return true;
      return !acceptedTypes.some(type => file.type?.includes(type.replace('*', '')));
    });
  }

  removeFile(file?: TuiFileLike): void {
    if (!file) {
      this.control.setValue([]);
    } else {
      const updated = (this.control.value ?? []).filter(f => f !== file);
      this.control.setValue(updated);
    }
  }

  private processFiles(files: TuiFileLike[] | null): Observable<TuiFileLike[]> {
    if (!files?.length) return of([]);

    this.failedFiles$.next([]);
    this.loadingFiles$.next(files);

    const tasks = files.map(file =>
      timer(300).pipe(
        map(() => {
          // Simulate validation success (can be replaced with real logic)
          const success = Math.random() < 0.1;
          if (!success) {
            this.failedFiles$.next([file]);
            return null;
          }
          return file;
        })
      )
    );

    return forkJoin(tasks).pipe(
      map(results => results.filter((f): f is TuiFileLike => f !== null)),
      finalize(() => this.loadingFiles$.next([]))
    );
  }
}
