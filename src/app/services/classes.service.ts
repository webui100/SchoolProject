import { NotificationService } from './notification.service';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
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

  addClass(classData){
    this.http.post(`${this.BASE_URI}classes`, classData, {observe: 'response'})
    .subscribe(response => {
      this.notify.notifySuccess('Успішно створено');
    },
    error => {
      this.errorMessage(error);
    }
    
    
    )
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


// вызываем фенкцию onSubmit.
// достать значения с формконтролов и засунуть в объект.
// вызвать функцию addClass в onSubmit.
// объект передаем в бади в функцию addClass.
