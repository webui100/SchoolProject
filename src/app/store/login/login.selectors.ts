import { createSelector } from '@ngrx/store';

import { State as AppState } from '../index';
import { State as UserState } from './login.reducer';

export const selectUser = (state: AppState) => state.user;

export const selectRolePure = (state: UserState) => state.role;
export const selectUserId = (state: UserState) => state.id;

export const selectRole = createSelector(
  selectUser,
  selectRolePure
);

export const selectId = createSelector(
  selectUser,
  selectUserId
);


