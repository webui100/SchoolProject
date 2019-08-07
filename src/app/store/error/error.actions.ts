import { createAction, props } from '@ngrx/store';

export const setErrorAction = createAction(
  '[Error] Global error',
  props<{ error: Error }>()
);


export const removeErrorAction = createAction(
  '[Error] Global error removed',
  props<{ error: Error}>()
);
