import { createAction, props } from "@ngrx/store";

export const getStudentsAction = createAction(
  "[Students Page] GetStudents",
  props<{ students: any }>()
);
export const addStudentsAction = createAction(
  "[Students Page] AddStudent",
  props<{ addedStudent: any }>()
);
export const updateStudentsAction = createAction(
  "[Students Page] UpdateStudent",
  props<{ editedStudent: any }>()
);
