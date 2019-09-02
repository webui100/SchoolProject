import { Student } from './../../models/students';
import { createAction, props } from '@ngrx/store';

export const addTransferStudent = createAction(
  '[NEW YEAR] add students',
  props<{ students: Array<Student> }>()
)

export const setYear = createAction(
  '[NEW YEAR] set year',
  props<{ year: number }>()
)

export const changeOnlyWithStudents = createAction(
  '[NEW YEAR] change isWithStudents',
  props<{ isWithStudents: boolean }>()
)