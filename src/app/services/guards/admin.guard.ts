import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from '../auth.service';
import jwt_decode from '../../../../node_modules/jwt-decode';

@Injectable()
export class AdminGuard implements CanActivate{

  constructor(private _authService: AuthService,
              private _route: Router
    ) {}

  canActivate(): boolean {
    if (this.authorizedAsAdmin()) {
          this._authService.tokenizedUser();
          return true;
        } else {
          this._route.navigate(['']);
          return false;
        }
    }

    authorizedAsAdmin(): boolean {
      if (this._authService.loggedIn()
          && jwt_decode(this._authService.getToken()).Roles.authority === 'ROLE_ADMIN') {
          return true;
        } else {
          return false;
      }
    }

  }
