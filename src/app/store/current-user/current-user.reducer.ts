import { Action, createReducer, on } from '@ngrx/store';
import { currentUserAction } from './current-user.action';
import { User } from '../../models/user.model';

export interface CurrentUserState {
  currentUserData: User;
}

export const initialState: CurrentUserState = {
  currentUserData: null
};

const reducer = createReducer(
  initialState,
  on(currentUserAction, (state, { currentUserData }) => ({
    ...state,
    currentUserData
  }))
);

export function currentUserReducer(state: CurrentUserState | undefined, action: Action) {
  return reducer(state, action);
}
