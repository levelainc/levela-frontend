import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StepUserTypeComponent } from './pages/step-user-type.component';
import { StepProfileDetailsComponent } from './pages/step-profile-details.component';
import { StepVerificationComponent } from './pages/step-verification.component';
import { StepSuccessComponent } from './pages/step-success.component';

  const routes: Routes = [
    { path: 'type', loadComponent: () => import('./pages/step-user-type.component').then(m => m.StepUserTypeComponent) },
    { path: 'profile', loadComponent: () => import('./pages/step-profile-details.component').then(m => m.StepProfileDetailsComponent) },
    { path: 'verify', loadComponent: () => import('./pages/step-verification.component').then(m => m.StepVerificationComponent) },
    { path: 'success', loadComponent: () => import('./pages/step-success.component').then(m => m.StepSuccessComponent) },
    { path: '', redirectTo: 'type', pathMatch: 'full' },
  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnboardingRoutingModule {}
