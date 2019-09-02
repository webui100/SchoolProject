import { Action, createReducer, on } from '@ngrx/store';
import { fetchDiary } from './diary.actions';
import { Lesson } from '../../models/diary.model';

export interface DiaryState {
  lessons: Lesson[];
}

export const initialState: DiaryState = {
  lessons: null
};

const reducer = createReducer(
  initialState,
  on(fetchDiary, (state, { lessons }) => ({
    ...state,
    lessons
  }))
);

export function diaryReducer(state: DiaryState | undefined, action: Action) {
  return reducer(state, action);
}
