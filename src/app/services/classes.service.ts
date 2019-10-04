import { NotificationService } from './notification.service';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import {
  getClassAction,
  addClassAction,
  editClassAction } from '../store/classes/classes.action';
  import ClassModel from 'src/app/models/schoolclass.model';

@Injectable({
  providedIn: 'root'
})
export class ClassesService {
  public subject = new Subject<string | ArrayBuffer>();
  private BASE_URI = environment.APIEndpoint;
  private CLASSES_URI = 'classes/';
  constructor(
    private http: HttpClient,
    private store: Store<{ classState }>,
    private notify: NotificationService
  ) {}

  getClasses() {
    this.http.get(`${this.BASE_URI}${this.CLASSES_URI}`).subscribe(response => {
      this.store.dispatch(getClassAction({ classesList: response["data"] }));
    });
  }

  addClass(classData: ClassModel) {
    this.http.post(`${this.BASE_URI}${this.CLASSES_URI}`, classData).subscribe(
      response => {
        this.notify.notifySuccess("Успішно створено");
        this.store.dispatch(addClassAction({ newClass: response["data"] }));
      },
      error => {
        this.errorMessage(error);
      }
    );
  }

  editClass(classId: number, classData: ClassModel) {
    this.http.put(`${this.BASE_URI}${this.CLASSES_URI}${classId}`, classData).subscribe(
      response => {
        this.notify.notifySuccess("Успішно відредаговано");
        this.store.dispatch(editClassAction({ editClass: response["data"] }));
      },
      error => {
        this.errorMessage(error);
      }
    );
  }

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
    else if (current.key.includes("(") && previous.key.includes("(")) {
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

  private errorMessage(err: any) {
    if (err.error.status.code === 400) {
      this.notify.notifyFailure("Невірно введені дані");
      throw new Error(`Server error: ${err.error.data}`);
    } else {
      const errParse = this.notify.errorParser(err);
      this.notify.notifyFailure(errParse);
      throw new Error(`Server error: ${err.error.data}`);
    }
  }
}
