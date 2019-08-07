import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { getSchedule } from '../store/schedule/schedule.actions';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private BASE_URI = environment.APIEndpoint;

  constructor(private http: HttpClient,
              private store: Store<{schedule}>) { }
// : Observable<any>
  getSchedule(classId) {
    return this.http.get(`${this.BASE_URI}classes/${classId}/schedule`)
      .subscribe(res => this.store.dispatch(getSchedule(classId)));
  }

}
