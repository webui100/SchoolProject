import { State as AppState } from '../index';

export const selectAllJournals = (state: AppState) => state.teacherPanel.journalsList;

export const selectAllSubjects = (state: AppState) => state.teacherPanel.subjectsList;
