import { Action, createReducer, on } from "@ngrx/store";
import * as JournalData from "./teacher-journals.action";

export interface State {
  data: Array<Object>;
}

export const initialState: State = {
  data: null
};

const reducer = createReducer(
  initialState,
  on(JournalData.teacherJournalAction, (state, { data }) => ({
    ...state,
    data
  }))
);

export function teacherJournalsDataReducer(state: State | undefined, action: Action) {
  return reducer(state, action);
}
