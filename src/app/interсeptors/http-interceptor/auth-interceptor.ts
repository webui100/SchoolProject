import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';

import {AuthService} from '../../services/auth.service';
import {Observable} from 'rxjs/internal/Observable';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(public auth: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();
    if (token) {
      return next.handle(
        req.clone({
          headers: req.headers.append('Authorization', token),
          responseType: 'json',
        })
      );
    }
    return next.handle(req);
  }
}
