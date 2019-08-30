import { createAction, props } from '@ngrx/store';
import { Lesson } from '../../models/diary.model';

export const fetchDiary = createAction(
  '[Student Diary] Fetch',
  props<{ lessons: Lesson[] }>()
);
