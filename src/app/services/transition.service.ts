import { ClassesService } from './classes.service';
import { selectTransferedClasses } from './../store/newyear/newyear.selector';
import ClassModel from 'src/app/models/schoolclass.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { from, Observable, Subject } from 'rxjs';
import { NotificationService } from './notification.service';
import { addTransferStudent } from '../store/newyear/newyear.actions';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class TransitionService {

  constructor(private http: HttpClient, private notificationService: NotificationService,
    private classesService: ClassesService, private store: Store<{ newYear }>, ) { }

  dispatchStudents(id: number) {
    return this.http
      .get(`${environment.APIEndpoint}students/classes/${id}`)
      .subscribe(res => {
        this.store.dispatch(addTransferStudent({ students: res["data"] }));
      });
  }

  getStudents(classesList: Array<ClassModel>) {
    const setStudentsObs: Observable<any> = from(classesList).pipe(
      map((classObj: ClassModel) => {
        return this.dispatchStudents(classObj.id)
      })
    );
    return setStudentsObs;
  }

  // Creates new className based on previous name
  genereteNewClassName(className: string): string {
    const simpleClassName = /^\d+[-][А-ЩЬЮЯҐЄІЇа-щьюяґєії]/i;
    const complexClassName = /^\d+[(]\d+[-][А-ЩЬЮЯҐЄІЇа-щьюяґєії][)]/i;

    function simpleReplacer(match, p1, p2) {
      let number = +p1;
      if (number >= 11) {
        return ''
      }
      return (++number) + p2;
    }

    function complexReplacer(match, p1, p2, p3, p4) {
      let number1 = +p1;
      if (number1 >= 11) {
        return ''
      }
      let number2 = +p3;
      if (number2 >= 11) {
        return ''
      }
      return `${++number1}${p2}${++number2}${p4}`;
    }

    if (simpleClassName.test(className)) {
      return className.replace(/^(\d+)([-][А-ЩЬЮЯҐЄІЇа-щьюяґєії])/i, simpleReplacer)
    } else if (complexClassName.test(className)) {
      return className.replace(/^(\d+)([(])(\d+)([-][А-ЩЬЮЯҐЄІЇа-щьюяґєії][)])/i, complexReplacer)
    }
    return '';
  }

  // Create new class based on previous year class with new name, year and id
  createNewClass(classArr: Array<ClassModel>): Observable<Array<ClassModel>> {

    const newClassArr = classArr.map((item: ClassModel) => {
      const newObj: ClassModel = {
        ...item,
        className: this.genereteNewClassName(item.className),
        classDescription: item.classDescription || '',
        classYear: item.classYear + 1
      };

      return newObj;
    });
    return this.http.post(`${environment.APIEndpoint}students/transition`, newClassArr)
      .pipe(
        map((responce: { data: any }) => responce.data)
      );
  }

  bindStudentsToNewClass(idArr: Array<{ newClassId: number, oldClassId: number }>): Observable<any> {
    return this.http.put(`${environment.APIEndpoint}students/transition`, idArr).pipe(
      map((responce: { data: any }) => responce.data)
    );
  }

  transferStudents(oldClassArr: Array<ClassModel>, studingYear: number) {

    const idArr: Array<{ newClassId: number, oldClassId: number }> = [];
    let transferedClasses = [];
    const transferClassesRef = this.store.select(selectTransferedClasses, { year: studingYear })
      .subscribe((value) => transferedClasses = value);

    // get already transfered classes without students transition
    // or classes that are going to graduate
    let existingClasses = transferedClasses.filter((existingClass: ClassModel) => {
      return !!oldClassArr.find((oldClass: ClassModel) => {
        return existingClass.className === this.genereteNewClassName(oldClass.className)
      })
    })

    // get classes that not exist in new year
    let readyToTransferClasses = oldClassArr.filter((oldClass: ClassModel) => {
      if (!this.genereteNewClassName(oldClass.className)) {
        return false;
      }
      if (existingClasses.length > 0) {
        return !!existingClasses.find((existingClass: ClassModel) => {
          return _.isEqual(existingClass, oldClass)
        })
      } else {
        return true;
      }

    })

    let graduatedClasses = oldClassArr.filter((oldClass: ClassModel) => {
      return !this.genereteNewClassName(oldClass.className);
    })

    // for classes that aren't exists in new year
    if (readyToTransferClasses.length > 0) {
      this.createNewClass(readyToTransferClasses).toPromise()
        .then((newClassArray: Array<ClassModel>) => {
          newClassArray.forEach((newClassItem: ClassModel) => {
            idArr.push({
              newClassId: newClassItem.id,
              oldClassId: readyToTransferClasses.find((oldClassItem: ClassModel) => {
                return this.genereteNewClassName(oldClassItem.className) === newClassItem.className;
              }).id
            })
          })
          return idArr;
        })
        .then((idArr: Array<{ newClassId: number, oldClassId: number }>) => {
          return this.bindStudentsToNewClass(idArr).toPromise();
        })
        .then(() => {
          this.notificationService.notifySuccess('Успішно переведено')
        })
        .then(() => {
          this.classesService.getClasses();
        })
        .catch((error) => {
          this.notificationService.notifyFailure('Не вдалося перевести');
          console.log(error);
        })
    }


    // for classes that exists in new year

    if (existingClasses.length > 0 || graduatedClasses.length > 0) {
      this.sendIdArray(oldClassArr, existingClasses, graduatedClasses);
    }

    transferClassesRef.unsubscribe();


  }

  // transfer students to already created classes or 
  // transfer graduated classes
  sendIdArray(oldClassArr: Array<ClassModel>,
    existingClasses: Array<ClassModel>,
    graduatedClasses: Array<ClassModel>) {
    // create array of new and old ids
    let idArr: Array<{ newClassId: number, oldClassId: number }>;
    let existingIdsArr: Array<{ newClassId: number, oldClassId: number }> = [];
    let graduatedIdsArr: Array<{ newClassId: number, oldClassId: number }> = [];

    if (existingClasses.length > 0) {
      existingIdsArr = existingClasses.reduce((acc, existingClass: ClassModel) => {
        acc.push({
          newClassId: existingClass.id,
          oldClassId: oldClassArr.find((oldClass: ClassModel) => {
            return this.genereteNewClassName(oldClass.className) === existingClass.className;
          }).id
        })
        return acc;
      }, []);
    }

    if (graduatedClasses.length > 0) {
      graduatedIdsArr = graduatedClasses.reduce((acc, graduatedClass: ClassModel) => {
        acc.push({
          newClassId: 0,
          oldClassId: graduatedClass.id
        })
        return acc;
      }, [])
    }

    idArr = existingIdsArr.concat(graduatedIdsArr);


    this.bindStudentsToNewClass(idArr).toPromise()
      .then((value) => {
        this.notificationService.notifySuccess('Успішно переведено')
      })
      .then(() => {
        this.classesService.getClasses();
      })
      .catch((error) => {
        this.notificationService.notifyFailure('Не вдалося перевести');
        console.log(error);
      })
  }
}

interface Responce {
  data: Array<ClassModel>
}