import { Teacher } from '../../models/teacher.model';
import { createSelector } from '@ngrx/store';
import { State as AppState } from '../index';

export const selectTeachers = (state: AppState) => state.teachers.teachersList;

export const selectTeachersByName = createSelector(
    selectTeachers,
    (state: Teacher[]) => {
         return state.sort((a: Teacher, b: Teacher): any => {
            return a.firstname.localeCompare(b.firstname);
        });
    }
);


