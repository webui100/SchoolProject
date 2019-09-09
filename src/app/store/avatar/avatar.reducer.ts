import { Action, createReducer, on } from "@ngrx/store";
import * as Avatar from "./avatar.actions";
import { state } from "@angular/animations";

export interface State {
  avatar: any;
}

export const initialState: State = {
  avatar: null
};

const AvatarReducer = createReducer(
  initialState,
  on(Avatar.getAvatarAction, (state, { avatar }) => ({
    ...state,
    avatar
  }))
);

export function avatarReducer(state: State | undefined, action: Action) {
  return AvatarReducer(state, action);
}
