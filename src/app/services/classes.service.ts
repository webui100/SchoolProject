import { NotificationService } from './notification.service';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Observer, Subject } from 'rxjs';
import { getClassAction } from  '../store/classes/classes.action';


@Injectable({
  providedIn: 'root'
})
export class ClassesService {
  public subject = new Subject<string | ArrayBuffer>();
  private BASE_URI = environment.APIEndpoint;

  constructor(
    private http: HttpClient,
    private store: Store<{ classState }>,
    private notify: NotificationService) {
  }

  getClasses(){
    this.http.get(`${this.BASE_URI}classes`).subscribe(response => { 
        this.store.dispatch(getClassAction({classesList: response['data']}));
      })      
  }
}
