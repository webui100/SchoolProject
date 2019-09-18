import { State as AppState } from "../index";
import { createSelector } from "@ngrx/store";

export const selectStudentsData = (state: AppState) => state.students;
export const selectClassesData = (state: AppState) => state.classesList;
