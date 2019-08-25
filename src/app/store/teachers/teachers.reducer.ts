import { Action, createReducer, on } from '@ngrx/store';
import * as TeacherData from './teachers.action';
import { ITeacher, IBindTeacher } from 'src/app/models/teacher.model';

export interface State {
  teachersList: Array<object>;
  sortOptions: object;
  bindedTeachers: IBindTeacher[];
  teacherID: number;
}

export const initialState: State = {
  teachersList: null,
  sortOptions: { direction: 'asc', column: 'firstname' },
  bindedTeachers: [],
  teacherID: null
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
      teachersList: state.teachersList.map(
        (teacher: ITeacher, index: number) => {
          if (teacher.id === deleteTeacher && teacher !== undefined) {
            state.teachersList.splice(index, 1);
          } else {
            return teacher;
          }
        }
      )
    };
  }),
  on(TeacherData.bindTeacher, (state: State, { bindTeacher, teacherID }) => {
    return {
      ...state,
      bindedTeachers: [...state.bindedTeachers, {id: teacherID, bindTeacher}]
    };
  }),
  on(TeacherData.teacherID, (state: State, { teacherID }) => {
    return {
      ...state,
      teacherID
    };
  })
);

export function teachersDataReducer(state: State | undefined, action: Action) {
  return reducer(state, action);
}
