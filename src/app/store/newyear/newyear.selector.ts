import { Student } from './../../models/students';
import ClassModel from 'src/app/models/schoolclass.model';
import { createSelector } from '@ngrx/store';

import { State as AppState } from '../index';

const selectClasses = (state: AppState) => state.classes.classesList;
const selectStudents = (state: AppState) => state.newYear.transferStudents;

export const selectTransferClasses = createSelector(
  selectClasses,
  (classes) => {
    if(!classes) {
      return []
    }
    return classes
    .filter((item: ClassModel) => item.isActive != false)
    .filter((item: ClassModel) => item.classYear === 2019)
    // .filter((item: ClassModel) => item.numOfStudents !== 0)
  }
)

export const selectTransferStudents = createSelector(
  selectStudents,
  selectTransferClasses,
  (students, classes) => {
    if(students) {
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