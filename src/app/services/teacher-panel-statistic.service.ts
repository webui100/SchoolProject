import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Store } from '@ngrx/store';
import {HttpClient} from '@angular/common/http';
import { getStudentsAction, getMarksAction} from '../store/teacher-panel-statistics/teacher-panel-statistics.action';

@Injectable({
  providedIn: 'root'
})
export class TeacherPanelStatisticService {
    private BASE_URI = environment.APIEndpoint;
    constructor(private http: HttpClient,
    private store: Store<{ object }>){ };
    public indicateOfWorking;

    // Get students by class_id
    getStudentsService(class_id) { 
      return this.http.get(`${this.BASE_URI}students/classes/${class_id}`)
      .subscribe(response => {
        //@ts-ignore
        this.store.dispatch(getStudentsAction({ studentsList: response.data }));
      });
  }
    // Get marks
    getMarksService(student_id, subject_id, start_date, end_date) { 
      return this.http.get(`${this.BASE_URI}marks?student_id=${student_id}&subject_id=${subject_id}&period_start=${start_date}&period_end=${end_date}`) 
      .subscribe(response => {
        console.log("service works");
        //@ts-ignore
        this.store.dispatch(getMarksAction({ marksList: response.data }));
      });
    }
}
