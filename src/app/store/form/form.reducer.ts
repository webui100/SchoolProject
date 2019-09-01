import { Action, createReducer, on } from "@ngrx/store";
import * as Form from "./form.actions";
import { state } from "@angular/animations";

export interface State {
  avatar: any;
}

export const initialState: State = {
  avatar: null
};

const FormReducer = createReducer(
  initialState,
  on(Form.getAvatarAction, (state, { avatar }) => ({
    ...state,
    avatar
  }))
);

export function formReducer(state: State | undefined, action: Action) {
  return FormReducer(state, action);
}
