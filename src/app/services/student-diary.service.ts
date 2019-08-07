import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { fetchDiary } from '../store/diary/diary.actions'

@Injectable({
  providedIn: 'root'
})
export class StudentDiaryService {
  constructor(
    private http: HttpClient,
    private store: Store<{ diary }>
  ) {}

  private BASE_URI = environment.APIEndpoint;

  fetchStudentDiary(data) {
    return this.http
      .get(`${this.BASE_URI}diaries?weekStartDate=${data}`, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: '*/*'
        }),
        observe: 'response'
      })
      .subscribe(response => {
        this.store.dispatch(fetchDiary({ diary: response.body }));
      });
  }
}
