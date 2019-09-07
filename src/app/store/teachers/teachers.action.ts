import { createAction, props } from '@ngrx/store';
import { ITeacher } from 'src/app/models/teacher.model';

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
    props<{ editedTeacher: ITeacher }>()
);

export const sortColumn = createAction(
    '[SortColumn] sortColumn',
    props<{ sortOptions: object}>()
);

export const deleteTeacher = createAction(
    '[DeleteTeacher] deleteTeacher',
    props<{ deleteTeacher: number}>()
);

export const bindTeacher = createAction(
    '[BindTeacher] bindTeacher',
    props<{ bindTeacher: object}>()
);

export const addBindTeacher = createAction(
    '[AddBindTeacher] addBindTeacher',
    props <{ addBindTeacher: object }>()
);

