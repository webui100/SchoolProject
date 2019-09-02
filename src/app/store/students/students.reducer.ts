import { Action, createReducer, on } from "@ngrx/store";
import * as GetStudents from "./students.action";
import { state } from "@angular/animations";
import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
export const adapter: EntityAdapter<any> = createEntityAdapter();
export interface State {
  students: Array<Object>;
  selectedStudent: Object;
}

export const initialState: State = {
  students: null,
  selectedStudent: null
};

const StudentsReducer = createReducer(
  initialState,
  on(GetStudents.getStudentsAction, (state, { students }) => ({
    ...state,
    students
  })),
  on(GetStudents.createStudentsAction, (state, { createdStudent }) => {
    return {
      ...state,
      students: [...state.students, createdStudent]
    };
  }),
  on(GetStudents.updateStudentsAction, (state, { editedStudent }) => {
    return {
      ...state,
      students: state.students.map(student =>
        student.id === editedStudent.id ? editedStudent : student
      )
    };
  }),
  on(GetStudents.deleteStudentAction, (state, { deleteStudent }) => {
    return {
      ...state,
      students: state.students.map((student, index) => {
        if (student.id == deleteStudent) {
          state.students.splice(index, 1);
        } else {
          return student;
        }
      })
    };
  })
);

export function studentsReducer(state: State | undefined, action: Action) {
  return StudentsReducer(state, action);
}
