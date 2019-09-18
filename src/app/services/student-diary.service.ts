import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { map} from 'rxjs/operators';
import { format } from 'date-fns';
import { saveAs } from 'file-saver';

import { environment } from '../../environments/environment';
import { fetchDiary } from '../store/diary/diary.actions';
import { HomeworkFile } from '../models/diary.model';


@Injectable({
  providedIn: 'root'
})
export class StudentDiaryService {

  private BASE_URI = environment.APIEndpoint;

  constructor(
    private http: HttpClient,
    private store: Store<{ diary }>
  ) {}

  fetchStudentDiary(data: Date) {
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
      .subscribe((response: any) => {
        this.store.dispatch(fetchDiary({ lessons: response.body.data }));
      });
  }

  downloadHomeworkFile(lessonId: number) {
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

  openHomeworkFile(lessonId: number) {
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
      );
  }

  uploadFile(inputValue: HTMLInputElement) {
    const file: File = inputValue.files[0];
    const type = file.type;
    const name = file.name;
    const reader: FileReader = new FileReader();
    reader.onloadend = () => {
      // this.subject.next(reader.result);
      console.log('reader result --- ', `${reader.result}`.split(',')[1]);
    };
  }
}
