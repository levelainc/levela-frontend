import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:5000/api/auth'; // Update this for production

  constructor(private http: HttpClient, private router: Router) {}

  register(payload: { full_name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, payload);
  }

  login(payload: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, payload).pipe(
      tap((response: any) => {
        if (response.access_token) {
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      })
    );
  }



  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  verifyEmail(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify`, { token });
  }


}

