import { createAction, props } from '@ngrx/store';

export const teacherJournalAction = createAction(
    '[Journals Data] JournalsData',
    props<{ data: any}>()
)