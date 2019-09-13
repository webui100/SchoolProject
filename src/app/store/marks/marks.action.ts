import { createAction, props } from '@ngrx/store';
import { IMarkType } from '../../models/mark-type.model';


export const marksListAction = createAction(
    '[Marks List] marksList',
    props<{ marksList: IMarkType[]}>()
);

export const markTypeAdd = createAction(
    '[Add Mark] Add Mark',
    props<{ addMark: IMarkType}>()
);

export const markTypeEdit = createAction(
    '[Edit Mark] Edit Mark',
    props<{ editMark: IMarkType}>()
);

