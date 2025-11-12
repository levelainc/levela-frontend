import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface User {
  id: string;
  full_name: string;
  email: string;
  is_verified: boolean;
  is_onboarded: boolean;
  // Add more fields if needed
}

interface LoginResponse {
  access_token: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:5000/api/auth';

  /** Reactive state for the current user */
  private userSubject = new BehaviorSubject<User | null>(this.loadUserFromStorage());
  readonly user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  /** Load user from localStorage on init */
  private loadUserFromStorage(): User | null {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      console.warn('Corrupted user data found in localStorage. Clearing...');
      localStorage.removeItem('user');
      return null;
    }
  }

  /** Persist user + token and update reactive stream */
  private persistUser(user: User, token: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  register(payload: { full_name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, payload);
  }

  login(payload: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap((res) => {
        if (res?.access_token && res?.user) {
          this.persistUser(res.user, res.access_token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/housing']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /** Sync user state with what is stored in localStorage */
  refreshUser(): void {
    this.userSubject.next(this.loadUserFromStorage());
  }

  verifyEmail(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify`, { token });
  }
}
