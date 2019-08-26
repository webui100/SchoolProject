import { createAction, props } from '@ngrx/store';

export const setClearedSchedule = createAction(
  '[Admin Schedule] Set Cleareed Schedule',
  props<{ clearedData: object }>()
);

export const setSavedSchedule = createAction(
  '[Admin Schedule] Set Saved Schedule',
  props<{ savedData: object }>()
);

export const setSchedule = createAction(
  '[Admin Schedule] Set Schedule',
  props<{ data: object }>()
);
