import { createAction, props } from '@ngrx/store';
import { IMarkType } from '../../models/mark-type.model';


export const marksListAction = createAction(
    '[Marks List] marksList',
    props<{ marksList: IMarkType[]}>()
);
