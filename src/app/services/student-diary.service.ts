import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import { map} from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { fetchDiary } from '../store/diary/diary.actions';
import { HomeworkFile } from '../models/homework-file.model';


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
    const formattedDate = format(
      new Date(data),
      'YYYY-MM-DD'
    );
    return this.http
      .get(`${this.BASE_URI}diaries?weekStartDate=${formattedDate}`, {
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

  fetchHomeworkFile(lessonId) {
    return this.http
      .get(`${this.BASE_URI}homeworks/files/${lessonId}`, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: '*/*'
        }),
        observe: 'response'
      })
      .pipe(
        map(response => response.body),
        map((body: HomeworkFile) => body.data)
      )
      .subscribe(result => {
        const file = `data:${result.fileType};base64,${result.fileData}`;
        const fileName = result.fileName;
        saveAs(file, fileName);
      });
  }
}
