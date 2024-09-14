import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, map, Observable, Subject, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (request: HttpRequest<any>, next: HttpHandlerFn): Observable<any> => {
  const authService = inject(AuthService);
  let refreshTokenInProgress = false;
  const tokenRefreshedSource = new Subject<void>();
  const tokenRefreshed$ = tokenRefreshedSource.asObservable();

  request = addAuthHeader(request);

  // Handle response
  return next(request).pipe(
    catchError(error => handleResponseError(error, request, next, authService, refreshTokenInProgress, tokenRefreshedSource, tokenRefreshed$))
  );
};

// Helper function to add Authorization header
function addAuthHeader(request: HttpRequest<any>): HttpRequest<any> {
  const accountToken = sessionStorage.getItem("token");

  let modifiedRequest = request.clone({
    setHeaders: { Channel: 'STORE' }
  });

  if (accountToken) {
    return modifiedRequest.clone({
      setHeaders: { Authorization: `Bearer ${accountToken}` }
    });
  }

  return request;
}

// Function to handle response errors
function handleResponseError(error: any, request: HttpRequest<any>, next: HttpHandlerFn, authService: AuthService, refreshTokenInProgress: boolean, tokenRefreshedSource: Subject<void>, tokenRefreshed$: Observable<void>): Observable<any> {
  // Business error
  if (error.status === 400) {
    // Show message (can be customized)
  }

  // Invalid token error (401)
  else if (error.status === 401) {
    return refreshToken(authService, refreshTokenInProgress, tokenRefreshedSource, tokenRefreshed$).pipe(
      switchMap(() => {
        request = addAuthHeader(request);
        return next(request);
      }),
      catchError((e: any) => {
        if (e.status !== 401) {
          return handleResponseError(e, request, next, authService, refreshTokenInProgress, tokenRefreshedSource, tokenRefreshed$);
        } else {
          authService.redirectInvalid();
          return throwError(() => e);
        }
      })
    );
  }

  // Access denied error (403)
  else if (error.status === 403) {
    // Show message and logout
    authService.redirectInvalid();
  }

  // Server error (500)
  else if (error.status === 500) {
    // Show message (can be customized)
  }

  // Maintenance error (503)
  else if (error.status === 503) {
    // Show message and redirect to the maintenance page
  }

  return throwError(() => error);
}

// Function to refresh token
function refreshToken(authService: AuthService, refreshTokenInProgress: boolean, tokenRefreshedSource: Subject<void>, tokenRefreshed$: Observable<void>): Observable<any> {
  if (refreshTokenInProgress) {
    return new Observable(observer => {
      tokenRefreshed$.subscribe(() => {
        observer.next();
        observer.complete();
      });
    });
  } else {
    refreshTokenInProgress = true;
    return authService.renewRefreshToken().pipe(
      map((data: any) => {
        sessionStorage.setItem('token', data.jwt);
        sessionStorage.setItem('refreshToken', data.refreshToken);
        refreshTokenInProgress = false;
        tokenRefreshedSource.next();
      }),
      catchError((err: any) => {
        refreshTokenInProgress = false;
        authService.redirectInvalid();
        return throwError(() => err);
      })
    );
  }
}

