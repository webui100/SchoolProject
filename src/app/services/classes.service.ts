import { NotificationService } from './notification.service';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Observer, Subject } from 'rxjs';
import { getClassAction } from '../store/classes/classes.action';

@Injectable({
  providedIn: 'root'
})
export class ClassesService {
  public subject = new Subject<string | ArrayBuffer>();
  private BASE_URI = environment.APIEndpoint;

  constructor(
    private http: HttpClient,
    private store: Store<{ classState }>,
    private notify: NotificationService
  ) {}
  sortClasses() {
    return this.sortKeys;
  }

  // Sorting Accordions of Classes.
  // At first sort "main" classes "1-11"
  private sortKeys(current, previous) {
    const parsedCurrent = Number(current.key);
    const parsedPrevious = Number(previous.key);
    // Sorting logic
    function isNumber(value) {
      return Number.isInteger(value);
    }
    function getClassinScopes(clasName) {
      return Number(clasName.match(/\((.*)\)/)[1]);
    }

    if (isNumber(parsedCurrent) && isNumber(parsedPrevious)) {
      return parsedCurrent - parsedPrevious;
    } else if (
      isNumber(parsedCurrent) &&
      !isNumber(parsedPrevious) &&
      parsedCurrent != 0
    ) {
      return -1;
    }
    // Sorting custom classes "4(8)  at first by custom class.( in scopes "(8)").
    // Then by main (class before scopes).
    else if (current.key.includes('(') && previous.key.includes('(')) {
      const currentCustomClass = getClassinScopes(current.key);
      const previousCustomClass = Number(previous.key.match(/\((.*)\)/)[1]);
      const currentMainClass = parseInt(current.key);
      const previousMainClass = parseInt(previous.key);
      if (
        currentCustomClass == previousCustomClass &&
        currentMainClass < previousMainClass
      ) {
        return currentMainClass - previousMainClass;
      } else {
        return currentCustomClass - previousCustomClass;
      }
    } else {
      return 1;
    }
  }

  getClasses() {
    this.http.get(`${this.BASE_URI}classes`).subscribe(response => {
      this.store.dispatch(getClassAction({ classesList: response['data'] }));
    });
  }
}
