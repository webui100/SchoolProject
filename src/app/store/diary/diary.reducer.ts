import { Action, createReducer, on } from '@ngrx/store';
import { fetchDiary } from './diary.actions';
import { Diary } from '../../models/diary.model';

export interface State {
  diary: Diary;
}

export const initialState: State = {
  diary: null
};

const reducer = createReducer(
  initialState,
  on(fetchDiary, (state, { diary }) => ({
    ...state,
    diary
  }))
);

export function diaryReducer(state: State | undefined, action: Action) {
  return reducer(state, action);
}
