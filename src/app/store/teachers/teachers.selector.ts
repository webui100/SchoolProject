import { createSelector } from '@ngrx/store';
import { State as AppState } from '../index';
import { ISortOptions } from 'src/app/models/sortOptions.model';
import { ITeacher } from 'src/app/models/teacher.model';
import { selectAllSubjects } from '../subjects/subjects.selector';
import { selectClassesList } from '../classes/classes.selector';

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

export const teachersSortByName =  createSelector(
  sortOptions,
  selectTeachers,
  ({column, direction}: ISortOptions, state: ITeacher[]) => {
    if (state) {
      const filtered = [...state].sort((a: object, b: object): number => {
        return a[column].localeCompare(b[column]);
      });
      if (direction === 'desc') {
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
  (journal, subjects, classes) => (
    {
      teacherId: id,
      journalList: journal,
      subjectList: subjects,
      classList: classes,
    }
  )
);

