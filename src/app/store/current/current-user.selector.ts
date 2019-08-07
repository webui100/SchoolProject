import { createSelector } from '@ngrx/store';

import { State as AppState } from '../index';
import { State as CurrentUserState } from './current-user.reducer'

export const selectCurrentUser = (state: AppState) => state.currentUser;

export const selectData = (state: CurrentUserState) => state.currentUserData;

export const selectAll = createSelector(
  selectCurrentUser,
  selectData
);
