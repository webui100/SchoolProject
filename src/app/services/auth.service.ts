import { environment } from '../../environments/environment';
import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import * as jwt_decode from '../../../node_modules/jwt-decode';

import { Store, select } from '@ngrx/store';
import { login } from '../store/login/login.actions';
import { selectRole, selectId } from '../store/login/login.selectors';
import { takeUntil, tap } from 'rxjs/operators';

import { timer } from 'rxjs/internal/observable/timer';
import { Subject } from 'rxjs/internal/Subject';

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
    // console.log('I\'m OnDestroy AuthService');
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
        localStorage.setItem('token', token);
        this.tokenizedUser();
        // this.refreshTokenTimer();

        this.id$.subscribe((data) => this.id = data);
        this.role$.subscribe((data) => this.role = data);

        this.moveUserToPage();
      })
  }


  tokenizedUser(): void {
    const token = localStorage.getItem('token');
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
    localStorage.removeItem('token');
    this.router.navigate(['']);
    this.store.dispatch(login({ role: null, id: null }));
    sessionStorage.removeItem('role');
  }

  getToken(): string {
    return localStorage.getItem('token');
  }

  refreshToken() {
    const tokenValid = this.isTokenValid();
    console.log(tokenValid);
    if (!tokenValid) {
      return this.http.get(this.BASE_URI + 'refresh', { observe: 'response' })
        // .pipe(tap(res => console.log(res)))
        .subscribe(res => {
          const newToken = res.headers.get('Authorization');
          localStorage.setItem('token', newToken);
          console.log('token refreshed');
        }, err => console.log(err + 'Your token is still old =)')
        );
    }
  }


  loggedIn() {
    return !!localStorage.getItem('token');
  }

  isTokenValid(): boolean {
    const currentToken = localStorage.getItem('token');
    const currentTokenExpirationDate = jwt_decode(currentToken).exp;
    const currentTime = Date.now();
    if (((currentTokenExpirationDate * 1000) - currentTime) > 3500000) {
      // console.log(currentTokenExpirationDate)
      // console.log(((currentTokenExpirationDate * 1000) - currentTime))
      return true;
    }
    return false;
  }


  refreshTokenTimer() {
    return timer(600000, 1200000).pipe(
      takeUntil(this.timerTerminator$));
  }

}

