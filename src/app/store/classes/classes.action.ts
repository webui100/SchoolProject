import { createAction, props } from '@ngrx/store';

export const getClassAction = createAction(
    '[Classes List] classesList',
    props<{ classesList: Array<Object>}>()
);


