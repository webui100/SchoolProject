import { createSelector, State } from '@ngrx/store';
import { State as AppState } from '../index';
import { SortOptions } from 'src/app/models/sortOptions.model';
import { isNull } from 'util';

export const selectTeachers = (state: AppState) => state.teachers.teachersList;

export const sortOptions = (state: AppState) => state.teachers.sortOptions;

export const teachersSortByName = createSelector(
  selectTeachers,
  sortOptions,
  (state: AppState[], options: SortOptions ) => {
    if (!isNull(state)) {
    let sorted = state.sort(
      (a, b) => {
        const res = a[options.column].localeCompare(b[options.column]);
        return res;
      }
    );
    if (options.direction === 'desc') {
      sorted = sorted.reverse();
    }
    return state;
  }
  }
);
