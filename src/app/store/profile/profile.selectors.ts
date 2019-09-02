import { State as AppState } from '../index';

export const selectStudentProfile = (state: AppState) => state.profile.student;
