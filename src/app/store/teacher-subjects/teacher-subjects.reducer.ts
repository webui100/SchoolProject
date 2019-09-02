import { Action, createReducer, on } from "@ngrx/store";
import * as SubjectData from "./teacher-subjects.action";

export interface State {
  data: Array<Object>;
}

export const initialState: State = {
  data: null
};

const reducer = createReducer(
  initialState,
  on(SubjectData.teacherSubjectAction, (state, { data }) => ({
    ...state,
    data
  }))
);

export function teacherSubjectsDataReducer(state: State | undefined, action: Action) {
  return reducer(state, action);
}
