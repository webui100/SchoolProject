import { createAction, props } from "@ngrx/store";

export const getAvatarAction = createAction(
  "[Form Page] GetAvatar",
  props<{ avatar: any }>()
);
