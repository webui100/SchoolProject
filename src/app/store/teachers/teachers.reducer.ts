import { Teacher } from '../../models/teacher.model';
import { Action, createReducer, on } from '@ngrx/store';
import * as TeacherData from './teachers.action';
import { map } from 'rxjs/operators';

export interface State {
  teachersList: Array<object>;
}

export const initialState: State = {
  teachersList: null,
};

const reducer = createReducer(
  initialState,
  on(TeacherData.teacherAction, (state, { teachersList }) => ({
    ...state,
    teachersList
  })),
  on(TeacherData.addOneTeacher, (state, { teacher }) => {
    return {
      ...state,
      teachersList: [...state.teachersList, teacher]
    };
  }),
  on(TeacherData.editTeacher, (state, { editedTeacher }) => {
    return {
      ...state,
      teachersList: state.teachersList.map(teacher => {
        // @ts-ignore
        return teacher.login === editedTeacher.login ? editedTeacher : teacher;
      })
    };
  })
);

export function teachersDataReducer(state: State | undefined, action: Action) {
  return reducer(state, action);
}
