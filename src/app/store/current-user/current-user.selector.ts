import { State as AppState } from '../index';

export const selectCurrentUser = (state: AppState) => state.currentUser.currentUserData;
