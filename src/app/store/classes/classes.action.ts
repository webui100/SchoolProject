import { createAction, props } from '@ngrx/store';
import ClassModel from 'src/app/models/schoolclass.model';

export const getClassAction = createAction(
  '[Classes List] classesList',
  props<{ classesList: Array<Object> }>()
);

export const addClassAction = createAction(
  '[New Class] newClass',
  props<{ newClass: ClassModel }>()
);

export const editClassAction = createAction(
  '[Edit Class] editClass',
  props<{ editClass: ClassModel }>()
);
