import { createAction, props } from '@ngrx/store';

export const fetchDiary = createAction(
  '[Student Diary] Fetch',
  props<{ diary: object }>()
);
