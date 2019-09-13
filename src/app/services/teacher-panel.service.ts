import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Store } from '@ngrx/store';
import { getTeacherJournalsAction, getTeacherSubjectsAction } from '../store/teacher-panel/teacher-panel.action';
import * as jwt_decode from 'jwt-decode';

@Injectable({
    providedIn: "root"
  })
export class TeacherPanelService{
    private BASE_URI = environment.APIEndpoint;
    constructor(private http: HttpClient,
    private store: Store<{ object }>){ }

    getTeacherId() {
      const token = localStorage.getItem('token');
      return jwt_decode(token).jti;
    }
//------------------------------------------------------------
    getTeacherSubjectsService() { 
      const teacherId = this.getTeacherId();
      return this.http.get(`${this.BASE_URI}subjects/teachers/${teacherId}`)
      .subscribe(response => {
        //@ts-ignore
        this.store.dispatch(getTeacherSubjectsAction({ subjectsList: response.data }));
      });
  }
//------------------------------------------------------------  
    getTeacherJournalsService() { 
        const teacherId = this.getTeacherId();
        return this.http.get(`${this.BASE_URI}journals/teachers/${teacherId}/active`)
        .subscribe(response => {
          //@ts-ignore
          this.store.dispatch(getTeacherJournalsAction({ journalsList: response.data }));
        });
    }
  }



