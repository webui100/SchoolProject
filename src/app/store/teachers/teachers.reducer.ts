import { Action, createReducer, on } from '@ngrx/store';
import * as TeacherData from './teachers.action';
import { Teacher } from 'src/app/models/teacher.model';



export interface State {
  teachersList: Array<object>;
  sortOptions: object;
}

export const initialState: State = {
  teachersList: null,
  sortOptions: { direction: 'asc', column: 'firstname'}
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
      teachersList: state.teachersList.map((teacher: Teacher) => {
        return teacher.login === editedTeacher.login ? editedTeacher : teacher;
      })
    };
  }),
  on(TeacherData.sortColumn, (state: State, { sortOptions }) => {
    return {
      ...state,
      sortOptions
    };
  })

);

export function teachersDataReducer(state: State | undefined, action: Action) {
  return reducer(state, action);
}
