import { Action, createReducer, on } from '@ngrx/store';
import * as TeacherData from './teachers.action';
import { ITeacher, IBindTeacher } from 'src/app/models/teacher.model';

export interface State {
  teachersList: Array<object>;
  sortOptions: object;
  bindedTeachers: IBindTeacher[];
}

export const initialState: State = {
  teachersList: null,
  sortOptions: { direction: 'asc', column: 'lastname' },
  bindedTeachers: []
};

const reducer = createReducer(
  initialState,
  on(TeacherData.teacherAction, (state: State, { teachersList }) => ({
    ...state,
    teachersList
  })),
  on(TeacherData.addOneTeacher, (state: State, { teacher }) => {
    return {
      ...state,
      teachersList: [...state.teachersList, teacher]
    };
  }),
  on(TeacherData.editTeacher, (state: State, { editedTeacher }) => {
    return {
      ...state,
      teachersList: state.teachersList.map((teacher: ITeacher) => {
        return teacher.login === editedTeacher.login ? editedTeacher : teacher;
      })
    };
  }),
  on(TeacherData.sortColumn, (state: State, { sortOptions }) => {
    return {
      ...state,
      sortOptions
    };
  }),
  on(TeacherData.deleteTeacher, (state: State, { deleteTeacher }) => {
    return {
      ...state,
      teachersList: state.teachersList.filter(
        (teacher: ITeacher) =>  teacher.id !== deleteTeacher
      )
    };
  }),
  on(TeacherData.bindTeacher, (state: State, { bindTeacher }) => {
    return {
      ...state,
      bindedTeachers: [...state.bindedTeachers, bindTeacher]
    };
  }),
  on(TeacherData.addBindTeacher, (state: State, { addBindTeacher }) => {
    return {
      ...state,
      bindedTeachers: state.bindedTeachers.map((el: IBindTeacher) => {
        const bindId = Object.keys(addBindTeacher)[0];
        if (el.hasOwnProperty(bindId)) {
          return { [bindId]: [...el[bindId], addBindTeacher[bindId]] };
        }
        return el;
      })
    };
  })
);

export function teachersDataReducer(state: State | undefined, action: Action): State {
  return reducer(state, action);
}
