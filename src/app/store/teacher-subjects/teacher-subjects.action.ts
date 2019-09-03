import { createAction, props } from '@ngrx/store';

export const teacherSubjectAction = createAction(
    '[Subjects Data] SubjectsData',
    props<{ data: any}>()
)