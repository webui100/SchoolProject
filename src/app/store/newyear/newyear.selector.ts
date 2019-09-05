import { Student } from './../../models/students';
import ClassModel from 'src/app/models/schoolclass.model';
import { createSelector } from '@ngrx/store';

import { State as AppState } from '../index';

const selectClasses = (state: AppState) => state.classes.classesList;
const selectStudents = (state: AppState) => state.newYear.transferStudents;
const selectYear = (state: AppState) => state.newYear.year;
const selectIsWithStudents = (state: AppState) => state.newYear.isWithStudents;

export const selectTransferClasses = createSelector(
  selectClasses,
  selectYear,
  selectIsWithStudents,
  (classes, year, isWithStudents) => {
    if (!classes) {
      return []
    }
    return classes
      .filter((item: ClassModel) => {
        return (item.isActive !== false) &&
          (item.classYear === year) &&
          (validateClassName(item.className)) &&
          (isWithStudents ? (item.numOfStudents !== 0) : true)
      })
      .sort((item1: ClassModel, item2: ClassModel) => {
        const item1ClassNumber = +item1.className.split(/[-(]/)[0];
        const item2ClassNumber = +item2.className.split(/[-(]/)[0];
        return item1ClassNumber - item2ClassNumber;
      })
  }
)

export const selectTransferStudents = createSelector(
  selectStudents,
  selectTransferClasses,
  (students, classes) => {
    if (students) {
      return classes.reduce((acc, classItem: ClassModel) => {
        acc[classItem.className] = students.filter((student: Student) => {
          return student.classId === classItem.id;
        })
        return acc;
      }, {})
    } else {
      return {}
    }

  }
)

export const selectTransferedClasses = createSelector(
  selectClasses,
  selectYear,
  (classes: Array<ClassModel>, year) => {
    if (!classes) {
      return []
    }
    return classes
      //.filter((item: ClassModel) => item.isActive !== false)
      .filter((item: ClassModel) => item.classYear === year + 1)
      .filter((item: ClassModel) => validateClassName(item.className))
      // .filter((item: ClassModel) => item.numOfStudents !== 0)
      .sort((item1: ClassModel, item2: ClassModel) => {
        const item1ClassNumber = +item1.className.split(/[-(]/)[0];
        const item2ClassNumber = +item2.className.split(/[-(]/)[0];
        return item1ClassNumber - item2ClassNumber;
      })
  }
)

export const selectClassesYears = createSelector(
  selectClasses,
  (classes) => {
    let yearsSet: Set<number> = new Set();
    if (!classes) {
      return yearsSet;
    }

    classes.forEach((classItem: ClassModel) => {
      yearsSet.add(classItem.classYear)
    })
    return yearsSet;
  }
)

function validateClassName(className: string): boolean {
  const simpleClassName = /^\d+[-][А-ЩЬЮЯҐЄІЇа-щьюяґєії]/i;
  const complexClassName = /^\d+[(]\d+[-][А-ЩЬЮЯҐЄІЇа-щьюяґєії][)]/i;
  if (simpleClassName.test(className)) {
    return true;
  } else if (complexClassName.test(className)) {
    return true;
  } else return false;
}