import { createSelector } from '@ngrx/store';
import { State as AppState } from '../index';
import { ISortOptions } from 'src/app/models/sortOptions.model';
import { ITeacher } from 'src/app/models/teacher.model';


export const selectTeachers = (state: AppState) => state.teachers.teachersList;

export const sortOptions = (state: AppState) => state.teachers.sortOptions;

export const teachersSortByName = createSelector(
  selectTeachers,
  sortOptions,
  (state: ITeacher[], options: ISortOptions) => {
    if (state !== null || undefined) {
      const filtered = state.filter(el => el !== undefined);
      filtered.sort(
        (a: any, b: any): number => {
            return a[options.column].localeCompare(b[options.column]);
        }
      );
      if (options.direction === 'desc') {
        filtered.reverse();
      }
      return filtered;
    }
  }
  );
