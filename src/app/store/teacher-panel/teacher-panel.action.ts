import { createAction, props } from '@ngrx/store';
import { TeacherJournals, TeacherSubjects } from '../../models/teacher-panel.model';

export const getTeacherSubjectsAction = createAction(
    '[Subjects Data] SubjectsData',
    props<{ subjectsList: TeacherSubjects}>()
);

export const getTeacherJournalsAction = createAction(
    '[Journals Data] JournalsData',
    props<{ journalsList: TeacherJournals}>()
);

export const setCurrentJournalAction = createAction(
    '[Journals Data] CurrentJournal',
    props<{ currentJournal: object }>()
);

export const setCurrentJournalToListAction = createAction(
    '[Journal Table] CurrentJournalToList',
    props<{ currentJournal: object, idClass: number, idSubject: number }>()
);

export const setCurrentLessonIdToStoreAction = createAction(
    '[Journal Table] CurrentLessonId',
    props<{ currentLessonId: number }>()
);

export const setHomeworkListAction = createAction(
    '[Journal Table] HomeworkList',
    props<{ homeworkList: object[] }>()
);

export const putHomeworkAction = createAction(
    '[Journal Table] SaveHomework',
    props<{ homework: object }>()
);

export const saveMarkAction = createAction(
    '[Journal Table] SaveMark',
    props<{ markData: object }>()
);

export const changeMarkTypeAction = createAction(
    '[Journal Table] ChangeMarkType',
    props<{ newMarkType: object, idLesson: number }>()
);