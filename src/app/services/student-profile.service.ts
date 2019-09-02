import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import * as jwt_decode from 'jwt-decode';

import { environment } from '../../environments/environment';
import { fetchStudentProfile } from '../store/profile/profile.actions';
import { currentUserAction } from '../store/current/current-user.action';


@Injectable({
  providedIn: 'root'
})
export class StudentProfileService {

  constructor(
    private http: HttpClient,
    private store: Store<{ profile }>
  ) {}

  private BASE_URI = environment.APIEndpoint;
  public subject = new Subject<string | ArrayBuffer>();

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

  editProfile(profile) {
    const studentId = StudentProfileService.getStudentId();
    return this.http
      .put(`${this.BASE_URI}students/${studentId}`, profile, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: '*/*'
        }),
        observe: 'response'
      })
      .subscribe((response: any) => {
        this.store.dispatch(fetchStudentProfile({ student: response.body.data }));
        this.store.dispatch(currentUserAction({ currentUserData: response.body.data }));
      });
  }

  readImage(inputValue: HTMLInputElement) {
    const file: File = inputValue.files[0];
    if (file.type.includes('image') && file.size < 1000000) {
      const reader: FileReader = new FileReader();
      reader.onloadend = () => {
        this.subject.next(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      this.subject.error('IncorrectFile');
    }
  }
}
