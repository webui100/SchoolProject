import { createSelector } from '@ngrx/store';
import { State as AppState } from '../index';
import { ISortOptions } from 'src/app/models/sortOptions.model';
import { ITeacher } from 'src/app/models/teacher.model';
import { selectAllSubjects } from '../subjects/subjects.selector';
import { selectClasses, selectClassesList } from '../classes/classes.selector';

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
    if (state) {
      const filtered = [...state];

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

export const getAllBindInfo = (id: number) => createSelector(
  getBindById(id),
  selectAllSubjects,
  selectClassesList,
  (journal, subjects, classes) => {
    return {
      teacherId: id,
      journalList: journal,
      subjectList: subjects,
      classList: classes,
    };
  }
);

