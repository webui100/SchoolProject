import { createAction, props } from '@ngrx/store';

export const teacherAction = createAction(
    '[Teachers List] teachersList',
    props<{ teachersList: Array<object>}>()
);

export const addOneTeacher = createAction(
    '[Add Teacher] addTeacher',
    props<{ teacher: object}>()
);

export const editTeacher = createAction(
    '[EditTeacher] editTeacher',
    props<{ editedTeacher: object}>()
);


