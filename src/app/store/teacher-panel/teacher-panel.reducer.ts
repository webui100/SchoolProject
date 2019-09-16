import { Action, createReducer, on } from "@ngrx/store";
import * as DataForTeacher from "./teacher-panel.action";
import { TeacherJournals, TeacherSubjects } from '../../models/teacher-panel.model';

export interface TeacherPanelState {
  subjectsList: TeacherSubjects;
  journalsList: TeacherJournals;
  currentJournal: object;
  uploadedJournals: object[],
  currentLessonId: number
}
export const initialState: TeacherPanelState = {
  subjectsList: null,
  journalsList: null,
  currentJournal: null,
  uploadedJournals: [],
  currentLessonId: null
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

  on(DataForTeacher.setCurrentJournalAction, (state, { currentJournal }) => ({
    ...state,
    currentJournal
  })),

  on(DataForTeacher.setCurrentJournalToListAction, (state, { currentJournal, idClass, idSubject }) => {
    const newList = [...state.uploadedJournals];
    const currentJournalObject = { journal: { ...currentJournal }, idClass, idSubject }
      newList.push(currentJournalObject);
    return ({
    ...state,
    uploadedJournals: newList
  })}),

  on(DataForTeacher.setCurrentLessonIdToStoreAction, (state, { currentLessonId }) => ({
    ...state,
    currentLessonId
  }))
);

export function dataForTeacherReducer(state: TeacherPanelState | undefined, action: Action) {
  return reducer(state, action);
}
