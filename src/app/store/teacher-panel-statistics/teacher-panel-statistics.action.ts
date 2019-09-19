import { createAction, props } from '@ngrx/store';
// import { TeacherJournals, TeacherSubjects } from '../../models/teacher-panel.model';

export const getStudentsAction = createAction(
    '[Students Data] StudentsData',
    props<{ studentsList: any}>()//change type!
);
export const getMarksAction = createAction(
    '[Marks Data] MarksData',
    props<{ marksList: any}>()//change type!
);




