import { addBindTeacher } from './../store/teachers/teachers.action';
import { IBindTeacher, IJournalBind } from './../models/teacher.model';
import { IHttpGetBindTeacher } from './../models/HttpResponse.model';
import { FormGroup, NgForm, AbstractControl } from '@angular/forms';
import { NotificationService } from './notification.service';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  teacherAction,
  addOneTeacher,
  editTeacher,
  deleteTeacher,
  bindTeacher
} from '../store/teachers/teachers.action';
import { Subject } from 'rxjs';
import {
  IHttpGetResponseList,
  IHttpPostPutResponse
} from '../models/HttpResponse.model';
import { ITeacher } from '../models/teacher.model';
import { startWith, map } from 'rxjs/operators';
import { IOptionsFilter } from '../models/optionsFilter.model';

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
  private JOURNALS_URI = 'journals/';
  private ACIVE_URI = 'active/';
  private CLASSES_URI = 'classes/';
  private SUBJECTS_URI = 'subjects/';
  private JOURNAL_URI = 'journal/';

  constructor(
    private http: HttpClient,
    private store: Store<object>,
    private notify: NotificationService
  ) {}

  getTeachers() {
    return this.http.get(`${this.BASE_URI}${this.TEACHER_URI}`).subscribe(
      (response: IHttpGetResponseList) => {
        this.store.dispatch(teacherAction({ teachersList: response.data }));
      },
      error => {
        this.errorMessage(error);
      }
    );
  }

  getTeacherBind(teacherId: number) {
    console.log(teacherId);
    return this.http
      .get(
        `${this.BASE_URI}${this.JOURNALS_URI}${this.TEACHER_URI}${teacherId}/${this.ACIVE_URI}`
      )
      .subscribe(
        (response: IHttpGetBindTeacher) => {
            this.store.dispatch(
              bindTeacher({ bindTeacher: { [teacherId]: response.data } })
            );
        },
        error => {
          this.errorMessage(error);
        }
      );
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
      .post<IHttpPostPutResponse>(`${this.BASE_URI}${this.TEACHER_URI}`, data, {
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
    return this.http
      .patch(`${this.BASE_URI}${this.USER_URI}${id}`, { observe: 'response' })
      .subscribe(
        () => {
          this.notify.notifySuccess('Успішно видалено');
          this.store.dispatch(deleteTeacher({ deleteTeacher: id }));
        },
        error => {
          this.errorMessage(error);
          this.notify.notifyFailure('Не вдалось видалити');
        }
      );
  }

  sendTeachersList() {
    return this.http
      .get(
        `${this.BASE_URI}${this.USER_URI}${this.CREDENTIALS_URI}${this.TEACHER_URI}`
      )
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

  teacherJournalBind(ids: IJournalBind) {
    const storeData =  {
         [ids.teacherId] : {
          subjectName: ids.subjectData.subjectName,
          className: ids.classData.className
      }
    };

    return this.http
      .post(
        `${this.BASE_URI}${this.TEACHER_URI}${ids.teacherId}/${this.CLASSES_URI}${ids.classData.id}
        /${this.SUBJECTS_URI}${ids.subjectData.subjectId}/${this.JOURNAL_URI}`,
        {}
      )
      .subscribe(
        () => {
          this.notify.notifySuccess('Дані відправлено успішно');
          this.store.dispatch(addBindTeacher({addBindTeacher: storeData}));
        },
        error => {
          this.errorMessage(error);
          this.notify.notifyFailure('Не вдалось відправити дані');
        }
      );
  }

  readFileImage(inputValue: HTMLInputElement) {
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

  private filter(value: any, arr: string[], property: string): string[] {
    const filterValue = value.toLowerCase();
    return arr.filter(option => {
      return option[property].toLowerCase().includes(filterValue);
    });
  }

  //  IOptionsFilter = { controlName: string, objProp: string, varName: string }
  public autocompleteFilter(data: any[], formControlers: AbstractControl, optionsString: IOptionsFilter) {
    return formControlers.get(optionsString.controlName).valueChanges
      .pipe(
        startWith(''),
        map(value => this.filter(value.toString(), data, optionsString.objProp )));
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
}
