import { StudentsService } from './students.service';
import ClassModel from 'src/app/models/schoolclass.model';
import {environment} from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap, mergeMap, reduce, map } from 'rxjs/operators';
import { from, Observable, Subscription } from 'rxjs';
import { NotificationService } from './notification.service';
import { addTransferStudent } from '../store/newyear/newyear.actions';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class TransitionService {

  constructor(private http: HttpClient, private notificationService: NotificationService,
    private studentsService: StudentsService, private store: Store<{ newYear }>,) { }

  dispatchStudents(id: number) {
    return this.http
      .get(`${environment.APIEndpoint}students/classes/${id}`)
      .subscribe(res => {
        this.store.dispatch(addTransferStudent({ students: res["data"] }));
      });
  }

  getStudents(classesList: Array<ClassModel>){
    const setStudentsObs: Observable<any> = from(classesList).pipe(
      map((classObj: ClassModel) => {
        return this.dispatchStudents(classObj.id)
      })
    );
    return setStudentsObs.subscribe();
  }

  // Creates new className based on previous name
  genereteNewClassName(className: string): string {
    const simpleClassName = /^\d+[-][А-ЩЬЮЯҐЄІЇа-щьюяґєії]/i;
    const complexClassName = /^\d+[(]\d+[-][А-ЩЬЮЯҐЄІЇа-щьюяґєії][)]/i;

    function simpleReplacer(match, p1, p2) {
      let number = +p1;
      if(number >= 11) {
        return 'Випускний класс'
      }
      return (++number) + p2;
    }

    function complexReplacer(match, p1, p2, p3, p4) {
      let number1 = +p1;
      if (number1 >= 11) {
        return 'Випускний класс'
      }
      let number2 = +p3;
      if (number2 >= 11) {
        return 'Випускний класс'
      }
      return `${++number1}${p2}${++number2}${p4}`;
    }

    if(simpleClassName.test(className)) {
      return className.replace(/^(\d+)([-][А-ЩЬЮЯҐЄІЇа-щьюяґєії])/i, simpleReplacer)
    } else if (complexClassName.test(className)) {
      return className.replace(/^(\d+)([(])(\d+)([-][А-ЩЬЮЯҐЄІЇа-щьюяґєії][)])/i, complexReplacer)
    }
    return '';
  }

  // Create new class based on previous year class with new name, year and id
  createNewClass(classArr: Array<ClassModel>): Observable<Array<ClassModel>> {

    const newClassArr = classArr.map((item: ClassModel) => {
      item.className = this.genereteNewClassName(item.className);
      item.classYear += 1;
      return item; //!!!!!!!!!!!!
    });
    return this.http.post(`${environment.APIEndpoint}students/transition`, newClassArr)
            .pipe(
              map((responce: {data: any}) => responce.data)
            );
  }
}

interface Responce {
  data: Array<ClassModel>
}