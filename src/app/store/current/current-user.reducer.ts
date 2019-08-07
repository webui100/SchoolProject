import {Action, createReducer, on} from "@ngrx/store";
import  * as CurrentUserData from "../../store/current/current-user.action"


export interface State {
  currentUserData: Object;
}

export const initialState: State = {
  currentUserData: null
};

const reducer = createReducer(
  initialState,
  on(CurrentUserData.currentUserAction, (state, { currentUserData }) => ({
    ...state,
    currentUserData
  }))
);

export function currentUserReducer(state: State | undefined, action: Action) {
  return reducer(state, action);
}
