import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

import {AuthService } from '../auth.service';


@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private _authService: AuthService, private _route: Router) {}
  canActivate() {
    if (this._authService.loggedIn()) {
      localStorage.removeItem('token');
      return true;
    } else {
      return true;
    }
  }
}
