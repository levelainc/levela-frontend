import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url = state.url;

    // Skip auth guard for these paths
    const bypassPaths = [
      '/auth/login',
      '/auth/verify-email',
    ];

    // Bypass onboarding check for onboarding routes
    const isOnboarding = url.startsWith('/onboarding');

    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    const userRaw = localStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;

    if (!user) {
      this.auth.logout();
      return false;
    }

    if (!user.is_verified && !bypassPaths.includes(url)) {
      this.router.navigate(['/auth/verify-email']);
      return false;
    }

    if (!user.is_onboarded && !isOnboarding && !bypassPaths.includes(url)) {
      this.router.navigate(['/onboarding/type']);
      return false;
    }

    return true;
  }
}
