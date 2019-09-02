import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Store } from '@ngrx/store';
import { teacherJournalAction } from '../store/teacher-journals/teacher-journals.action';
import * as jwt_decode from 'jwt-decode';

@Injectable({
    providedIn: "root"
  })
export class TeacherJournalsService{
    private BASE_URI = environment.APIEndpoint;
    constructor(private http: HttpClient,
    private store: Store<{ teacherJournals }>){ }

    static getTeacherId() {
      const token = localStorage.getItem('token');
      return jwt_decode(token).jti;
    }
    
    getTeacherJournalsService() { 
        const teacherId = TeacherJournalsService.getTeacherId();
        return this.http.get(`${this.BASE_URI}journals/teachers/${teacherId}/active`)
        .subscribe(response => {
          //@ts-ignore
          this.store.dispatch(teacherJournalAction({ data: response.data }));
        });
    }
  }



