import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const url = state.url;

    // Paths where we skip verification/onboarding checks
    const bypassPaths = ['/auth/login', '/auth/verify-email'];
    const isOnboarding = url.startsWith('/onboarding');

    // be logged in 
    if (!this.auth.isAuthenticated()) {
      return this.router.parseUrl('/auth/login');
    }

    // user from localStorage
    const userRaw = localStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;

    if (!user) {
      this.auth.logout();
      return this.router.parseUrl('/auth/login');
    }

    //Email verification check
    if (!user.is_verified && !bypassPaths.includes(url)) {
      return this.router.parseUrl('/auth/verify-email');
    }

    //Onboarding check
    if (!user.is_onboarded && !isOnboarding && !bypassPaths.includes(url)) {
      return this.router.parseUrl('/onboarding/type');
    }

    //Everything OK — allow access
    return true;
  }
}
