import { Action, createReducer, on } from "@ngrx/store";
import * as DataForTeacher from "./teacher-panel.action";
import { TeacherJournals, TeacherSubjects } from '../../models/teacher-panel.model';

export interface TeacherPanelState {
  subjectsList: TeacherSubjects;
  journalsList: TeacherJournals;
  currentJournal: object;
  uploadedJournals: object[],
  currentLessonId: number,
  homeworkList: object[]
}
export const initialState: TeacherPanelState = {
  subjectsList: null,
  journalsList: null,
  currentJournal: null,
  uploadedJournals: [],
  currentLessonId: null,
  homeworkList: []
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
  })),

  on(DataForTeacher.setHomeworkListAction, (state, { homeworkList }) => ({
    ...state,
    homeworkList
  })),

  on(DataForTeacher.putHomeworkAction, (state, { homework }) => {
    const newHomeworkList = JSON.parse(JSON.stringify(state.homeworkList));
    const index = newHomeworkList.findIndex((item: any) => 
      item.idLesson === (homework as any).idLesson
    );
    (newHomeworkList[index]as any).fileName = (homework as any).fileName;
    (newHomeworkList[index]as any).homework = (homework as any).homework;
    return ({
    ...state,
    homeworkList: newHomeworkList
  })}),

  on(DataForTeacher.saveMarkAction, (state, { markData }) => {
    const newUploadedJournals = JSON.parse(JSON.stringify(state.uploadedJournals));
    newUploadedJournals.forEach((journal: any) => {
      const studentIndex = Object.values(journal.journal).findIndex(item => 
        (item as any).idStudent == (markData as any).idStudent
      );
      if (studentIndex >= 0) {
        const lessonIndex = journal.journal[studentIndex].marks.findIndex(item =>
          item.idLesson ==  (markData as any).idLesson
        );
        if (lessonIndex >= 0) {
          journal.journal[studentIndex].marks[lessonIndex].mark = (markData as any).mark;
          journal.journal[studentIndex].marks[lessonIndex].note = (markData as any).note;
        }
      }
    });
    return ({
    ...state,
    uploadedJournals: newUploadedJournals
  })}),

  on(DataForTeacher.changeMarkTypeAction, (state, { newMarkType, idLesson }) => {
    const newUploadedJournals = JSON.parse(JSON.stringify(state.uploadedJournals));
    newUploadedJournals.forEach((journal: any) => {
      const lessonIndex = journal.journal[0].marks.findIndex(item => 
        item.idLesson ==  idLesson
      );
      if (lessonIndex >= 0) {
        Object.values(journal.journal).forEach((student: any) => {
          student.marks[lessonIndex].typeMark = (newMarkType as any).markType;
        })
      }
    });
    return ({
    ...state,
    uploadedJournals: newUploadedJournals
  })})
);

export function dataForTeacherReducer(state: TeacherPanelState | undefined, action: Action) {
  return reducer(state, action);
}
