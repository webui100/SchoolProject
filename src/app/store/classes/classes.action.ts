import { createAction, props } from '@ngrx/store';

export const getClassAction = createAction(
    '[Classes List] classesList', //why called so?
    props<{ classesList: Array<Object>}>()
);


