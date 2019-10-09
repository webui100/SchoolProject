import { environment } from '../../environments/environment';
import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import * as jwt_decode from '../../../node_modules/jwt-decode';

import { Store, select } from '@ngrx/store';
import { login } from '../store/login/login.actions';
import { selectRole, selectId } from '../store/login/login.selectors';
import { takeUntil, tap } from 'rxjs/operators';

import {timer} from 'rxjs/internal/observable/timer';
import {Subject} from 'rxjs/internal/Subject';
import { Logout } from '../store/logout.reducer';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private timerTerminator$ = new Subject();
  role$: any;
  role: any;
  id$: any;
  id: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<{ user }>,
  ) {
    this.role$ = this.store.pipe(select(selectRole));
    this.id$ = this.store.pipe(select(selectId));
  }

  private BASE_URI = environment.APIEndpoint;

  ngOnDestroy(): void {
    this.timerTerminator$.next();
    this.timerTerminator$.complete();
  }

  signIn(userData) {
    this.http
      .post(`${this.BASE_URI}signin`, userData, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: '*/*'
        }),
        observe: 'response'
      })
       .subscribe(response => {
          const token = response.headers.get('Authorization');
          this.setToken(token);
          this.tokenizedUser();

          this.id$.subscribe((data) => this.id = data);
          this.role$.subscribe((data) => this.role = data);
          this.moveUserToPage();
        })}


  tokenizedUser(): void {
    const token = this.getToken();
    const userRole = jwt_decode(token).Roles.authority;
    const userId = jwt_decode(token).jti;
    this.store.dispatch(login({ role: userRole, id: userId }));
  }

  moveUserToPage() {
    if (this.role === 'ROLE_ADMIN') {
      this.router.navigate(['admin']);
    } else if (this.role === 'ROLE_USER') {
      this.router.navigate(['student']);
    } else if (this.role === 'ROLE_TEACHER') {
      this.router.navigate(['teacher']);
    }
  }


  signOut() {
    sessionStorage.clear();
    this.router.navigate(['']);
    this.store.dispatch(new Logout());
  }

  getToken(): string {
    return sessionStorage.getItem('token');
  }

  setToken(token): void {
    sessionStorage.setItem('token', token);
  }

  refreshToken() {
    const tokenValid = this.isTokenValid();
    // console.log(tokenValid);
    if (!tokenValid) {
      return this.http.get(this.BASE_URI + 'refresh', {observe: 'response'})
        .subscribe(res => {
            const newToken = res.headers.get('Authorization');
            this.setToken(newToken);
            console.log('token refreshed');
          }, err => console.log(err + 'Your token is still old =)')
        );
    }
  }


  loggedIn() {
    return !!sessionStorage.getItem('token');
  }

  isTokenValid(): boolean {
    const currentToken = this.getToken();
    const currentTokenExpirationDate = jwt_decode(currentToken).exp;
    const currentTime = Date.now();
    if (((currentTokenExpirationDate * 1000) - currentTime) > 3500000) {
      return true;
    }
    return false;
  }


  refreshTokenTimer() {
    return timer(600000, 1200000).pipe(
      takeUntil(this.timerTerminator$));
    }
}

