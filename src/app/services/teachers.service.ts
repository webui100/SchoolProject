import { editTeacher } from './../store/teachers/teachers.action';
import { NotificationService } from './notification.service';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { teacherAction, addOneTeacher } from '../store/teachers/teachers.action';
import { Observable, Observer, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TeachersService {

  public subject = new Subject<string | ArrayBuffer>();
  private BASE_URI = environment.APIEndpoint;


  constructor(private http: HttpClient,
              private store: Store<{teachers}>,
              private notify: NotificationService) {
  }

  getTeachers() {
    return this.http.get(`${this.BASE_URI}teachers`)
    .subscribe(response => {
      // @ts-ignore
      this.store.dispatch(teacherAction({ teachersList: response.data }));
    });
  }

  editTeacher(teacherId, data) {
    return this.http.put(`${this.BASE_URI}admin/teachers/${teacherId}`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response'
    })
    .subscribe( (response) => {
      if (response.status === 200) {
        this.notify.notifySuccess('Успішно редаговано');
        // @ts-ignore
        this.store.dispatch(editTeacher({editedTeacher: response.body.data }));
      } else {
        this.notify.notifyFailure('Упс...щось пішло не так');
      }
    });
  }

  addTeacher(data) {
    return this.http.post(`${this.BASE_URI}teachers`, data,
    {
      observe: 'response'
    })
    .subscribe( (response) => {
      if (response.status === 200) {
        this.notify.notifySuccess('Успішно створено');
        // @ts-ignore
        this.store.dispatch(addOneTeacher({ teacher: response.body.data }));
      } else {
        this.notify.notifyFailure('Упс...щось пішло не так');
      }
    });
  }

  readFileImage(inputValue: HTMLInputElement) {
    const file: File = inputValue.files[0];
    const reader: FileReader = new FileReader();
    reader.onloadend = (e) => {
      this.subject.next(reader.result);
    };
    reader.readAsDataURL(file);
  }

  checkAgeDate() {
    const checkYear = new Date().getFullYear() - 18;
    return new Date(checkYear, new Date().getMonth(), new Date().getDate());
  }

}
