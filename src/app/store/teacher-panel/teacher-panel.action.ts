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




