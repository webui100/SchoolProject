import { Action, createReducer, on } from '@ngrx/store';
import { fetchDiary } from './diary.actions';

export interface Diary {
  data?: {
    date: [number, number, number];
    homeWork: string;
    homeworkFileId: number | null;
    lessonId: number;
    lessonNumber: number;
    mark: number;
    note: string;
    subjectName: string;
  }[];
}

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
