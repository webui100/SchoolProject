import { Action, createReducer, on } from "@ngrx/store";
import * as ClassData from "./classes.action";

export interface State {
  classesList: Array<object>;
}

export const initialState: State = {
  classesList: []
};
const reducer = createReducer(
  initialState,
  on(ClassData.getClassAction, (state, { classesList }) => ({
    ...state,
    classesList
  })),
  on(ClassData.addClassAction, (state, { newClass }) => {
    const newState = {...state};
    newState.classesList.push(newClass);
    return newState
  })
);

export function classesReducer(state: State | undefined, action: Action) {
  return reducer(state, action);
}
