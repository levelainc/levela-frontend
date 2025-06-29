import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { StepUserTypeComponent } from './pages/step-user-type.component';
import { StepProfileDetailsComponent } from './pages/step-profile-details.component';
import { StepVerificationComponent } from './pages/step-verification.component';
import { StepSuccessComponent } from './pages/step-success.component';
import { OnboardingRoutingModule } from './onboarding-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    OnboardingRoutingModule, // This was missing too!
    StepUserTypeComponent,
    StepProfileDetailsComponent,
    StepVerificationComponent,
    StepSuccessComponent,
  ],
})
export class OnboardingModule {}
