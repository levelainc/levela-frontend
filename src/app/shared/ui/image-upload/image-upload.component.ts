import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiFile, TuiFiles, TuiFileLike, tuiFilesAccepted } from '@taiga-ui/kit';
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
    TuiFile,

],
})
export class ImageUploadComponent implements OnInit {
  @Input() control!: FormControl<File[]>;
  label="Upload images "

  @Input()
  expanded=false

  @Input()
  size!:number

  get maxBytes(): number {
    return this.size * 1024 * 1024;
  }
  protected accepted$!: Observable<File[]>;
  ngOnInit(): void {
    if (!this.control) throw new Error('FormControl is required for image upload');

    this.control.setValue(this.control.value ?? []);
    // Initialize Subjects


    this.accepted$ = this.control.valueChanges.pipe(
      map(() => tuiFilesAccepted(this.control))
    );
  }



  protected rejected: readonly File[] = [];

  protected onReject(files: readonly File[]): void {
    this.rejected = Array.from(new Set(this.rejected.concat(files)));
  }

  protected onRemove(file: File): void {
    this.rejected = this.rejected.filter(f => f !== file);
    this.control.setValue(this.control.value?.filter(f => f !== file) ?? []);
  }
}
