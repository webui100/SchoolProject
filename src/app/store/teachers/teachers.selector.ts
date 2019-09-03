import { createSelector } from '@ngrx/store';
import { State as AppState } from '../index';
import { ISortOptions } from 'src/app/models/sortOptions.model';
import { ITeacher } from 'src/app/models/teacher.model';

export const selectTeachers = (state: AppState) => state.teachers.teachersList;

export const sortOptions = (state: AppState) => state.teachers.sortOptions;

export const teacherBindData = (state: AppState) =>
  state.teachers.bindedTeachers;

export const getBindById = (id: number) =>
  createSelector(
    teacherBindData,
    selectItems => {
      if (selectItems) {
        return selectItems.find( item => {
          const currentId = Object.keys(item)[0];             // get object keys
          return Number(currentId) === id;                    // cast to number
        });
      } else {
        return {};
      }
    }
  );

export const teachersSortByName = createSelector(
  selectTeachers,
  sortOptions,
  (state: ITeacher[], options: ISortOptions) => {
    if (state !== null || undefined) {
      const filtered = state.filter((el) => {
        return el !== undefined;
      });

      filtered.sort((a: any, b: any): number => {
        return a[options.column].localeCompare(b[options.column]);
      });
      if (options.direction === 'desc') {
        filtered.reverse();
      }
      return filtered;
    }
  }
);
