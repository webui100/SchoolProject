import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user.model';

export const currentUserAction = createAction(
  '[Current User] CurrentUser',
  props<{ currentUserData: User }>()
);
