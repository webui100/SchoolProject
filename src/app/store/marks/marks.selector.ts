import { State as AppState } from '../index';

export const selectMarks = (state: AppState) => state.marks.marksList;

