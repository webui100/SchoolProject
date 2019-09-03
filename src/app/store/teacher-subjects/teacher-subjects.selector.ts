import { createSelector } from '@ngrx/store';

import { State as AppState } from '../index';
import { State as TeacherSubjectsState } from './teacher-subjects.reducer'

export const selectSubjects = (state: AppState) => state.teacherSubjects;

export const selectData = (state: TeacherSubjectsState) => state.data;

export const selectAll = createSelector(
    selectSubjects,
    selectData
  );