import { createSelector } from '@ngrx/store';

import { State as AppState } from '../index';
import { State as SubjectsState } from './subjects.reducer'

export const selectSubjects = (state: AppState) => state.subjects;

export const selectData = (state: SubjectsState) => state.data;

export const selectAll = createSelector(
    selectSubjects,
    selectData
  );