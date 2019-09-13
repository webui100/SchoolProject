import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { NotificationService } from './notification.service';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { IHTTPGetResponse } from '../models/HttpResponse.model';
import { marksListAction, markTypeAdd, markTypeEdit } from '../store/marks/marks.action';

@Injectable({
  providedIn: 'root'
})
export class MarkControllerService {
  private BASE_URI = environment.APIEndpoint;
  private MARK_TYPES_URI = 'mark_types/';

  constructor(
        private http: HttpClient,
        private store: Store<object>,
        private notify: NotificationService) { }

  public getMarks() {
    return this.http.get(`${this.BASE_URI}${this.MARK_TYPES_URI}`)
    .subscribe(
      (response: IHTTPGetResponse) => {
        this.store.dispatch(marksListAction({marksList: response.data}));
      }
    );
  }

  public postMark(data) {
    return this.http.post(`${this.BASE_URI}${this.MARK_TYPES_URI}`, data)
    .subscribe(
      (response: IHTTPGetResponse) => {
      this.store.dispatch(markTypeAdd({addMark: response.data}));
      this.notify.notifySuccess('Успішно добавлено!');
    },
    error => {
      this.notify.showError('Не вдалось добавити оцінку', error);
    }
    );
  }

  public putMark(data) {
    return this.http.put(`${this.BASE_URI}${this.MARK_TYPES_URI}${data.id}`, data)
    .subscribe(
      (response: IHTTPGetResponse) => {
        this.store.dispatch(markTypeEdit({editMark: response.data}));
        this.notify.notifySuccess('Успішно редаговано!');
      },
      error => {
        this.notify.showError('Упс...не вдалось редагувати', error);
      }
    );
  }

}
