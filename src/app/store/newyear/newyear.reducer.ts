import { Student } from 'src/app/models/students';
import * as NewYearActions from './newyear.actions';
import { Action, createReducer, on } from '@ngrx/store';
import * as lodash from 'lodash';


export interface State {
  transferStudents: Array<Student>;
  year: number;
  isWithStudents: boolean;
}

export const initialState: State = {
  transferStudents: [],
  year: new Date(Date.now()).getFullYear() - 1,
  isWithStudents: false
}

const reducer = createReducer(
  initialState,
  on(NewYearActions.addTransferStudent, (state, { students }) => {
    return {
      ...state,
      transferStudents: addDistinct(state.transferStudents, students)
    }
  }),
  on(NewYearActions.setYear, (state, { year }) => {
    return {
      ...state,
      year
    }
  }),
  on(NewYearActions.changeOnlyWithStudents, (state, { isWithStudents }) => {
    return {
      ...state,
      isWithStudents: !state.isWithStudents
    }
  })
);

export function newYearReducer(state: State | undefined, action: Action) {
  return reducer(state, action);
}

// cheacks if some of new students is already exist in old storage
// returns new array of unique students
function addDistinct(storage: Array<Student>, arr: Array<Student>): Array<Student> {
  let result = [...storage];
  arr.forEach((newStudent: Student) => {
    if (!storage.some((storageStudent: Student) => {
      return lodash.isEqual(newStudent, storageStudent);
    })) {
      result.push(newStudent);
    }
  })
  return result;
}