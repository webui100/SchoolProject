import { Student } from './../../models/students';
import ClassModel from 'src/app/models/schoolclass.model';
import { createSelector } from '@ngrx/store';

import { State as AppState } from '../index';

const selectClasses = (state: AppState) => state.classes.classesList;
const selectStudents = (state: AppState) => state.newYear.transferStudents;

export const selectTransferClasses = createSelector(
  selectClasses,
  (classes) => {
    if (!classes) {
      return []
    }
    return classes
      .filter((item: ClassModel) => item.isActive !== false)
      .filter((item: ClassModel) => item.classYear === new Date(Date.now()).getFullYear())
      .filter((item: ClassModel) => validateClassName(item.className))
      .sort((item1: ClassModel, item2: ClassModel) => {
        const item1ClassNumber = +item1.className.split(/[-(]/)[0];
        const item2ClassNumber = +item2.className.split(/[-(]/)[0];
        return item1ClassNumber - item2ClassNumber;
      })
    // .filter((item: ClassModel) => item.numOfStudents !== 0)
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
  (classes: Array<ClassModel>) => {
    if (!classes) {
      return []
    }
    return classes
      //.filter((item: ClassModel) => item.isActive !== false)
      .filter((item: ClassModel) => item.classYear === new Date(Date.now()).getFullYear() + 1)
      .filter((item: ClassModel) => validateClassName(item.className))
      // .filter((item: ClassModel) => item.numOfStudents !== 0)
      .sort((item1: ClassModel, item2: ClassModel) => {
        const item1ClassNumber = +item1.className.split(/[-(]/)[0];
        const item2ClassNumber = +item2.className.split(/[-(]/)[0];
        return item1ClassNumber - item2ClassNumber;
      })
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