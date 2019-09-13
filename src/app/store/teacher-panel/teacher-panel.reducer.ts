import { Action, createReducer, on } from "@ngrx/store";
import * as DataForTeacher from "./teacher-panel.action";
import { TeacherJournals, TeacherSubjects } from '../../models/teacher-panel.model';

export interface TeacherPanelState {
  subjectsList: TeacherSubjects;
  journalsList: TeacherJournals;
}
export const initialState: TeacherPanelState = {
  subjectsList: null,
  journalsList: null
};

const reducer = createReducer(
  initialState,

  on(DataForTeacher.getTeacherSubjectsAction, (state, { subjectsList }) => ({
    ...state,
    subjectsList
  })),

  on(DataForTeacher.getTeacherJournalsAction, (state, { journalsList }) => ({
    ...state,
    journalsList
  })),
);

export function dataForTeacherReducer(state: TeacherPanelState | undefined, action: Action) {
  return reducer(state, action);
}
