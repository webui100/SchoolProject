import { createAction, props } from '@ngrx/store';

export const currentUserAction = createAction(
  '[Current User] CurrentUser',
  props<{ currentUserData: any}>()
)
