import { Action, createReducer, on } from "@ngrx/store";
import * as themeActions from "./theme.action";

export interface State {
  themeName: string;
}

export const initialState: State = {
  themeName: "dayTheme"
}

const reducer = createReducer(
  initialState,
  on(themeActions.setTheme, (state, { themeName }) => {
    return {
      ...state,
      themeName
    }
  })
)

export function themeReducer(state: State | undefined, action: Action) {
  return reducer(state, action);
}