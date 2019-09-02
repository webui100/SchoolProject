import { createAction, props } from "@ngrx/store";

export const getStudentsAction = createAction(
  "[Students Page] GetStudents",
  props<{ students: any }>()
);
export const createStudentsAction = createAction(
  "[Students Page] CreateStudent",
  props<{ createdStudent: any }>()
);
export const updateStudentsAction = createAction(
  "[Students Page] UpdateStudent",
  props<{ editedStudent: any }>()
);
export const deleteStudentAction = createAction(
  "[Students Page] DeleteStudent",
  props<{ deleteStudent: number }>()
);
