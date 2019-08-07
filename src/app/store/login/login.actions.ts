import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Login User] Login',
  props<{ role: string, id: number }>()
);