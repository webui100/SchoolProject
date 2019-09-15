import { createAction, props } from '@ngrx/store';

export const setTheme = createAction(
  "[THEME] setTheme",
  props<{ themeName: string }>()
)
