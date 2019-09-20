import { State as AppState } from '../index';
import { createSelector } from '@ngrx/store';

export const selectAllJournals = (state: AppState) => state.teacherPanel.journalsList;

export const selectAllSubjects = (state: AppState) => state.teacherPanel.subjectsList;

export const selectCurrentJournal = (state: AppState) => state.teacherPanel.currentJournal;

export const selectUploadedJournals = (state: AppState) => state.teacherPanel.uploadedJournals;

export const selectCurrentJournalData = createSelector(
    selectCurrentJournal,
    selectUploadedJournals,
    (currentJournal: any, journalsList: []) => (
        journalsList.filter((item: any) => item.idSubject === currentJournal.idSubject && item.idClass === currentJournal.idClass)[0]
    )
);

export const selectCurrentLessonId = (state: AppState) => state.teacherPanel.currentLessonId;

export const selectHomeworkList = (state: AppState) => state.teacherPanel.homeworkList;