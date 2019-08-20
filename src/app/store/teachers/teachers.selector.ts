import { createSelector } from '@ngrx/store';
import { State as AppState } from '../index';
import { SortOptions } from 'src/app/models/sortOptions.model';
import { SortService } from 'src/app/services/sort.service';

const sortService = new SortService();

export const selectTeachers = (state: AppState) => state.teachers.teachersList;

export const sortOptions = (state: AppState) => state.teachers.sortOptions;

export const teachersSortByName = createSelector(
  selectTeachers,
  sortOptions,
  (state: AppState[], options: SortOptions) => sortService.sortColumn(state, options)
  );
