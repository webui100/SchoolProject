import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Store, select} from '@ngrx/store';
import {selectId, selectRole} from '../store/login/login.selectors';
import {environment} from '../../environments/environment';
import {every, flatMap, map, switchMap, tap} from 'rxjs/operators';
import {currentUserAction} from '../store/current/current-user.action';
import {DomSanitizer} from '@angular/platform-browser';
import * as AdminData from './../models/admin-data';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  role$: any;
  role: any;
  id$: any;
  id: any;
  private BASE_URI = environment.APIEndpoint;

  constructor(private http: HttpClient,
              private store: Store<{ user }>,
              private sanitizer: DomSanitizer) {
    this.role$ = this.store.pipe(select(selectRole)).subscribe((data) => this.role = data);
    this.id$ = this.store.pipe(select(selectId)).subscribe((data) => this.id = data);
  }

  getCurrentUser() {
    if (this.role === 'ROLE_ADMIN') {
      this.store.dispatch(currentUserAction({ currentUserData: AdminData.adminData }));
    } else {
      let userUri = '';
      if (this.role === 'ROLE_TEACHER') {
          userUri = 'teachers/';
        } else if (this.role === 'ROLE_USER') {
          userUri = 'students/';
        }
      return this.http.get(this.BASE_URI + userUri + this.id, {observe: 'response'})
        .pipe(
          // @ts-ignore
          map(response => response.body.data))
        .subscribe(res => this.store.dispatch(currentUserAction({ currentUserData: res })));
      }
  }

  userRole(): string {
    if (this.role === 'ROLE_ADMIN') {
      return 'Адміністратор';
    } else if (this.role === 'ROLE_USER') {
      return 'Учень';
    } else {
      return 'Вчитель';
    }
  }

  imageTransform(stringImg) {
    if (stringImg !== null && (typeof stringImg !== 'undefined')) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(stringImg);
    }
  }

}
