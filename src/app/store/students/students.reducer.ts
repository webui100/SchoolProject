import { Action, createReducer, on } from "@ngrx/store";
import * as GetStudents from "./students.action";

export interface IStudents {
  students: Array<Object>;
  selectedStudent: Object;
}

export const initialState: IStudents = {
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
      students: state.students.filter(student => student.id !== deleteStudent)
    };
  })
);

export function studentsReducer(state: IStudents | undefined, action: Action) {
  return StudentsReducer(state, action);
}
