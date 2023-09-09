import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  let currentUser = authService.state();
  if (currentUser.jwt) {
    const header_clone = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${currentUser.jwt}`),
    });
    return next(header_clone);
  } else return next(req);
};
