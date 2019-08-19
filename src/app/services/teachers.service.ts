import { FormGroup } from '@angular/forms';
import { editTeacher } from './../store/teachers/teachers.action';
import { NotificationService } from './notification.service';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  teacherAction,
  addOneTeacher
} from '../store/teachers/teachers.action';
import { Subject } from 'rxjs';
import { HttpGetResponse, HttpPostPutResponse } from '../models/HttpResponse.model';
import { Teacher } from '../models/teacher.model';


@Injectable({
  providedIn: 'root'
})
export class TeachersService {
  public subject = new Subject<string | ArrayBuffer>();
  private BASE_URI = environment.APIEndpoint;
  private TEACHER_URI = 'teachers/';
  private ADMIN_URI = 'admin/';
  private USER_URI = 'users/';

  constructor(
    private http: HttpClient,
    private store: Store<object>,
    private notify: NotificationService,
  ) {}

  getTeachers() {
    return this.http
      .get(`${this.BASE_URI}${this.TEACHER_URI}`)
      .subscribe((response: HttpGetResponse) => {
        this.store.dispatch(teacherAction({ teachersList: response.data }));
      });
  }

  editTeacher(teacherId: number, data: Teacher) {
    return this.http
      .put<HttpPostPutResponse>(
        `${this.BASE_URI}${this.ADMIN_URI}${this.TEACHER_URI}${teacherId}`,
        data,
        {
          observe: 'response'
        }
      )
      .subscribe(
        response => {
          this.notify.notifySuccess('Успішно редаговано');
          this.store.dispatch(
            editTeacher({ editedTeacher: response.body.data })
          );
        },
        error => {
          this.errorMessage(error);
        }
      );
  }

  addTeacher(data: Teacher) {
    return this.http
      .post<HttpPostPutResponse>(`${this.BASE_URI}${this.TEACHER_URI}`,
      data,
      {
        observe: 'response'
      })
      .subscribe(
        response => {
          this.notify.notifySuccess('Успішно створено');
          this.store.dispatch(addOneTeacher({ teacher: response.body.data }));
        },
        error => {
          this.errorMessage(error);
        }
      );
  }

  deleteteacher(id: number) {
    this.http.patch(`${this.BASE_URI}${this.USER_URI}${id}`, id);
    console.log(`${this.BASE_URI}${this.USER_URI}${id}`);
  }

  readFileImage(inputValue: HTMLInputElement) {
    const file: File = inputValue.files[0];
    const reader: FileReader = new FileReader();
    reader.onloadend = () => {
      this.subject.next(reader.result);
    };
    reader.readAsDataURL(file);
  }

  errorMessage(err: any) {
    if (err.error.status.code === 400) {
      this.notify.notifyFailure('Невірно введені дані');
      throw new Error(`Server error: ${err.error.data}`);
    } else {
      const errParse = this.notify.errorParser(err);
      this.notify.notifyFailure(errParse);
      throw new Error(`Server error: ${err.error.data}`);
    }
  }

  checkAgeDate() {
    const checkYear = new Date().getFullYear() - 18;
    return new Date(checkYear, new Date().getMonth(), new Date().getDate());
  }

  clearForm(formName: FormGroup) {
    formName.reset();
    Object.keys(formName.controls).forEach(key => {
      formName.get(key).setErrors(null);
    });
  }
}
