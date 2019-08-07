import { createAction, props } from '@ngrx/store';

export const getSchedule = createAction(
  '[Admin Schedule] Get Schedule',
  props<{ id: number }>()
);
