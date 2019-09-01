import { createSelector } from '@ngrx/store';

import { State as AppState } from '../index';
import { State as ClassesState } from './classes.reducer';
import ClassModel from '../../models/schoolclass.model'

export const selectClasses = (state: AppState) => state.classes;

export const selectAllClasses = (state: AppState) => state.classes.classesList;

export const selectData = (state: ClassesState) => state.classesList;

export const selectClassesList = createSelector(
    selectClasses,
    selectData
  );
