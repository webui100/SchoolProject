import { Student } from './../../models/students';
import { createAction, props } from '@ngrx/store';

export const addTransferStudent = createAction(
  '[NEW YEAR] add students',
  props<{ students: Array<Student>}>()
)