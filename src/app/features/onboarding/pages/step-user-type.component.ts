import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';

import {
  TuiNotification,
  TuiAlertService,
  TuiButton,
  TuiTitle,
} from '@taiga-ui/core';
import { TuiCheckbox } from '@taiga-ui/kit';
import { HttpClient } from '@angular/common/http';
import { OnboardingService } from '../services/onboarding.service';

@Component({
  selector: 'app-step-user-type',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiNotification,
    TuiButton,
    TuiTitle,
    TuiCheckbox
],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './step-user-type.component.html',
  styleUrls: ['./step-user-type.component.less'],
})
export class StepUserTypeComponent {
  private readonly alerts = inject(TuiAlertService);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly onboardingService = inject(OnboardingService);

  readonly form = new FormGroup({
    student: new FormControl(false),
    serviceProvider: new FormControl(false),
  }, { validators: this.atLeastOneSelected });

  atLeastOneSelected(control: AbstractControl): ValidationErrors | null {
    const group = control as FormGroup;
    const hasAtLeastOneSelected = Object.values(group.controls).some(
      (ctrl) => ctrl.value === true
    );
    return hasAtLeastOneSelected ? null : { required: true };
  }

  submit(): void {
    if (this.form.invalid) {
      this.alerts.open('Please select at least one user type.', {
        label: 'Error',
        appearance: 'negative',
        autoClose: 3000,
      }).subscribe();
      return;
    }

    const formValue = this.form.value;
    const payload = {
      student: !!formValue.student,
      serviceProvider: !!formValue.serviceProvider,
    };

    this.onboardingService.saveUserTypeToBackend(payload).subscribe({
      next: () => {
        this.alerts.open('User type saved successfully.', {
          label: 'Success',
          appearance: 'positive',
          autoClose: 3000,
        }).subscribe();

        this.router.navigate(['/onboarding/profile']);
      },
      error: (error) => {
        const msg = error?.error?.message || 'Failed to save user type';
        this.alerts.open(msg, {
          label: 'Error',
          appearance: 'negative',
          autoClose: 5000,
        }).subscribe();
      },
    });

  }


}
