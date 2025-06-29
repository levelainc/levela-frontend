import { Component } from '@angular/core';
import { StepUserTypeComponent } from '../../../onboarding/pages/step-user-type.component';
import { StepProfileDetailsComponent } from '../../../onboarding/pages/step-profile-details.component';

@Component({
  selector: 'app-dashboard-page',
  imports: [StepUserTypeComponent,StepProfileDetailsComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.less'
})
export class DashboardPageComponent {

}
