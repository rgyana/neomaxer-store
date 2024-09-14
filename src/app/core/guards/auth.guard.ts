import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const isAuthenticated = authService.getAuthStatus();
  if (!isAuthenticated) {
    return router.createUrlTree(['/']); // Redirect to home if not authenticated
  }

  return isAuthenticated;
};
