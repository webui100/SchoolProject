import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Store } from '@ngrx/store';
import { teacherSubjectAction } from '../store/teacher-subjects/teacher-subjects.action';
import * as jwt_decode from 'jwt-decode';

@Injectable({
    providedIn: "root"
  })
export class TeacherSubjectsService{
    private BASE_URI = environment.APIEndpoint;
    constructor(private http: HttpClient,
    private store: Store<{teacherSubjects}>){ }

    static getTeacherId() {
      const token = localStorage.getItem('token');
      return jwt_decode(token).jti;
    }
    
    getTeacherSubjectsService() { 
        const teacherId = TeacherSubjectsService.getTeacherId();
        return this.http.get(`${this.BASE_URI}subjects/teachers/${teacherId}`)
        .subscribe(response => {
          //@ts-ignore
          this.store.dispatch(teacherSubjectAction({ data: response.data }));
        });
    }
  }



