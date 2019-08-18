import ClassModel from 'src/app/models/schoolclass.model';
import { createSelector } from '@ngrx/store';

import { State as AppState } from '../index';

const selectClasses = (state: AppState) => state.classes.classesList;

export const selectTransferClasses = createSelector(
  selectClasses,
  (classes) => {
    if(!classes) {
      return []
    }
    return classes
    .filter((item: ClassModel) => item.isActive != false)
    .filter((item: ClassModel) => item.classYear === 2019)
    .filter((item: ClassModel) => item.numOfStudents !== 0)
  }
)
