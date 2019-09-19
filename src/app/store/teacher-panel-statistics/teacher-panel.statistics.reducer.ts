import { Action, createReducer, on } from "@ngrx/store";
import * as DataMarks from "./teacher-panel-statistics.action";
import * as DataStudents from "./teacher-panel-statistics.action";
// import { TeacherJournals, TeacherSubjects } from '../../models/teacher-panel.model';

export interface TeacherPanelStatisticsState {
  marksList: any;
  studentsList: any;
}
export const initialState: TeacherPanelStatisticsState = {
  marksList: null,
  studentsList: null,
};

const reducer = createReducer(
  initialState,

  on(DataStudents.getStudentsAction, (state, { studentsList }) => ({
    ...state,
    studentsList
  })),
  on(DataMarks.getMarksAction, (state, { marksList }) => ({
    ...state,
    marksList
  })),
);

export function dataStatisticsReducer(state: TeacherPanelStatisticsState | undefined, action: Action) {
  return reducer(state, action);
}
