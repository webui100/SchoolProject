import { createAction, props } from '@ngrx/store';

export const subjectAction = createAction(
    '[Subjects Data] SubjectsData',
    props<{ data: any}>()
)