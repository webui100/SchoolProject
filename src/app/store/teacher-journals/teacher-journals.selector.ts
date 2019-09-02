import { createSelector } from '@ngrx/store';

import { State as AppState } from '../index';
import { State as TeacherJournalsState } from './teacher-journals.reducer'

export const selectJournals = (state: AppState) => state.teacherJournals;

export const selectData = (state: TeacherJournalsState) => state.data;

export const selectAll = createSelector(
    selectJournals,
    selectData
  );