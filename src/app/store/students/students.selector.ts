import { State as AppState } from "../index";

export const selectStudentsData = (state: AppState) => state.students;
export const selectClassesData = (state: AppState) => state.classesList;
