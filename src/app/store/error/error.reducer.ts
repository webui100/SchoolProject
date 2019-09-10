import { Action, createReducer, on } from '@ngrx/store';
import * as ErrorActions from './error.actions';


export interface State {
  errors: Array<Error>;
}

export const initialState: State = {
  errors: []
};


const reducer = createReducer(
  initialState,
  on(ErrorActions.setErrorAction, (state, { error }) => {
    return {
      ...state,
      errors: [...state.errors, error]
    }
  }),
  on(ErrorActions.removeErrorAction, (state, { error }) => {
    return {
      ...state,
      errors: state.errors.filter(item => item !== error)
    }
  })
);

export function errorReducer(state: State | undefined, action: Action) {
  return reducer(state, action);
}
