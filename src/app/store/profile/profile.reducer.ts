import { Action, createReducer, on } from '@ngrx/store';
import { fetchStudentProfile } from './profile.actions';
import { Student } from '../../models/profile.model';

export interface ProfileState {
  student: Student;
}

export const initialState: ProfileState = {
  student: null
};

const reducer = createReducer(
  initialState,
  on(fetchStudentProfile, (state, { student }) => ({
    ...state,
    student
  }))
);

export function profileReducer(state: ProfileState | undefined, action: Action) {
  return reducer(state, action);
}
