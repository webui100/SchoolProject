import { FormGroup } from '@angular/forms';
import { NotificationService } from './notification.service';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  teacherAction,
  addOneTeacher,
  editTeacher,
  deleteTeacher
} from '../store/teachers/teachers.action';
import { Subject } from 'rxjs';
import { IHttpGetResponse, IHttpPostPutResponse } from '../models/HttpResponse.model';
import { ITeacher } from '../models/teacher.model';



@Injectable({
  providedIn: 'root'
})
export class TeachersService {
  public subject = new Subject<string | ArrayBuffer>();
  private BASE_URI = environment.APIEndpoint;
  private TEACHER_URI = 'teachers/';
  private ADMIN_URI = 'admin/';
  private USER_URI = 'users/';
  private CREDENTIALS_URI = 'credentials/';

  constructor(
    private http: HttpClient,
    private store: Store<object>,
    private notify: NotificationService,
  ) {}

  getTeachers() {
    return this.http
      .get(`${this.BASE_URI}${this.TEACHER_URI}`)
      .subscribe((response: IHttpGetResponse) => {
        this.store.dispatch(teacherAction({ teachersList: response.data }));
      });
  }

  editTeacher(teacherId: number, data: ITeacher) {
    return this.http
      .put<IHttpPostPutResponse>(
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

  addTeacher(data: ITeacher) {
    return this.http
      .post<IHttpPostPutResponse>(`${this.BASE_URI}${this.TEACHER_URI}`,
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

  deleteTeacher(id: number) {
    return this.http.patch(`${this.BASE_URI}${this.USER_URI}${id}`, {observe: 'response'})
    .subscribe(
      () => {
        this.notify.notifySuccess('Успішно видалено');
        this.store.dispatch(deleteTeacher({ deleteTeacher: id })
        );
      },
      error => {
        this.errorMessage(error);
        this.notify.notifyFailure('Не вдалось видалити');
      }
    );
  }

  sendTeachersList() {
    return this.http.get(`${this.BASE_URI}${this.USER_URI}${this.CREDENTIALS_URI}${this.TEACHER_URI}`)
    .subscribe(
      () => {
        this.notify.notifySuccess('Дані відправлено успішно');
      },
      error => {
        this.errorMessage(error);
        this.notify.notifyFailure('Не вдалось відправити дані');
      }
    );
  }

  readFileImage(inputValue: HTMLInputElement) {
    const file: File = inputValue.files[0];
    console.log(file.type.includes('image'));
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

  private errorMessage(err: any) {
    if (err.error.status.code === 400) {
      this.notify.notifyFailure('Невірно введені дані');
      throw new Error(`Server error: ${err.error.data}`);
    } else {
      const errParse = this.notify.errorParser(err);
      this.notify.notifyFailure(errParse);
      throw new Error(`Server error: ${err.error.data}`);
    }
  }


  clearForm(formName: FormGroup) {
    formName.reset();
    Object.keys(formName.controls).forEach(key => {
      formName.get(key).setErrors(null);
    });
  }
}
