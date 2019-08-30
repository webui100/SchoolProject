import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store } from '@ngrx/store';
import * as jwt_decode from 'jwt-decode';

import { environment } from '../../environments/environment';
import { fetchStudentProfile } from '../store/profile/profile.actions';

@Injectable({
  providedIn: 'root'
})
export class StudentProfileService {

  constructor(
    private http: HttpClient,
    private store: Store<{ profile }>
  ) {}

  private BASE_URI = environment.APIEndpoint;

  static getStudentId() {
    const token = localStorage.getItem('token');
    return jwt_decode(token).jti;
  }

  fetchProfile() {
    const studentId = StudentProfileService.getStudentId();
    return this.http
      .get(`${this.BASE_URI}students/${studentId}`, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: '*/*'
        }),
        observe: 'response'
      })
      .subscribe((response: any) => {
        this.store.dispatch(fetchStudentProfile({ student: response.body.data }));
      });
  }
}
