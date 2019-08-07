import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Injectable()
export class AdminGuard implements CanActivate{

  constructor(private _authService: AuthService, private _route:Router){}
  canActivate(): boolean {
    if (this._authService.loggedIn() && (this._authService.role === 'ROLE_ADMIN')) {
      return true;
    } else {
      this._route.navigate(['']);
      return false;
    }

  }
}
