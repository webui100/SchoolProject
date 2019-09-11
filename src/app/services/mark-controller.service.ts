import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { NotificationService } from './notification.service';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { IHTTPGetResponse } from '../models/HttpResponse.model';
import { marksListAction } from '../store/marks/marks.action';

@Injectable({
  providedIn: 'root'
})
export class MarkControllerService {
  private BASE_URI = environment.APIEndpoint;
  private MARKS_TYPES_URI = 'mark_types/';

  constructor(
        private http: HttpClient,
        private store: Store<object>,
        private notify: NotificationService) { }

  public getMarks() {
    return this.http.get(`${this.BASE_URI}${this.MARKS_TYPES_URI}`)
    .subscribe(
      (response: IHTTPGetResponse) => {
        this.store.dispatch(marksListAction({marksList: response.data}));
      }
    );
  }

}
