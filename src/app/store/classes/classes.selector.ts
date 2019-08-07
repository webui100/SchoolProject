import { createSelector } from '@ngrx/store';

import { State as AppState } from '../index';
import { State as ClassesState } from './classes.reducer';

export const selectClasses = (state: AppState) => state.classes;

export const selectData = (state: ClassesState) => state.classesList;

export const selectClassesList = createSelector(
    selectClasses,
    selectData
  );

