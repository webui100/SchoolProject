import { Action, createReducer, on } from '@ngrx/store';
import * as Login from './login.actions';

export interface State {
  role: string;
  id: number;
}

export const initialState: State = {
  role: null,
  id: null
};

const reducer = createReducer(
  initialState,
  on(Login.login, (state, { role, id }) => ({
    ...state,
    role, id
  }))

);

export function loginReducer(state: State | undefined, action: Action) {
  return reducer(state, action);
}