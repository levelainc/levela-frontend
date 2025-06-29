import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import type { TuiFileLike } from '@taiga-ui/kit';

export interface OnboardingUser {
  fullName: string;
  //  more fields later like email, id, etc.
}

@Injectable({ providedIn: 'root' })
export class OnboardingService {
  private readonly userSubject = new BehaviorSubject<OnboardingUser | null>(null);
  user$: Observable<OnboardingUser | null> = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  setUser(user: OnboardingUser): void {
    this.userSubject.next(user);
  }

  private stepDataMap = new Map<string, any>();

  setStepData(step: string, data: any): void {
    this.stepDataMap.set(step, data);
  }

  getStepData(step: string): any {
    return this.stepDataMap.get(step);
  }

  isOnboardingComplete(): boolean {
    const userType = this.getStepData('user-type');
    const profile = this.getStepData('profile-details');
    const verification = this.getStepData('verification');

    return !!userType && !!profile && !!verification;
  }


  saveUserTypeToBackend(data: { student: boolean; serviceProvider: boolean }): Observable<any> {
    return this.http.post('/api/user/type', data);
  }

  saveProfileToBackend(data: {
    phone_number: string;
    bio: string;
    profile_picture: string | null;
  }): Observable<any> {
    return this.http.put('/api/user/profile', data);
  }

  saveVerificationToBackend(payload: {
    email?: string;
    file?: TuiFileLike | null;
  }): Observable<any> {
    const student_id_image = payload.file?.content?.toString(); // base64
    return this.http.post('/api/user/verify-docs', {
      institution_email: payload.email,
      student_id_image,
    });
  }

  markUserAsOnboarded(): Observable<any> {
    return this.http.put('/api/user/onboarded', {});
  }

}
