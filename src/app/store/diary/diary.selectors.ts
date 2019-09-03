import { State as AppState } from '../index';

export const selectLessons = (state: AppState) => state.diary.lessons;
