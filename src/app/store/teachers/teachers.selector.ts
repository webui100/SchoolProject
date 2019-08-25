import { IBindTeacher } from "./../../models/teacher.model";
import { createSelector } from "@ngrx/store";
import { State as AppState } from "../index";
import { ISortOptions } from "src/app/models/sortOptions.model";
import { ITeacher } from "src/app/models/teacher.model";

export const selectTeachers = (state: AppState) => state.teachers.teachersList;

export const sortOptions = (state: AppState) => state.teachers.sortOptions;

export const teacherBindData = (state: AppState) =>
  state.teachers.bindedTeachers;

export const selectTeacherID = (state: AppState) => state.teachers.teacherID;

export const teachersSortByName = createSelector(
  selectTeachers,
  sortOptions,
  (state: ITeacher[], options: ISortOptions) => {
    if (state !== null || undefined) {
      const filtered = state.filter((el, index) => {
        if (el !== undefined) {
          return el;
        } else {
          state.splice(index, 1);
        }
      });

      filtered.sort((a: any, b: any): number => {
        return a[options.column].localeCompare(b[options.column]);
      });
      if (options.direction === "desc") {
        filtered.reverse();
      }
      return filtered;
    }
  }
);

export const selectTeacherBind = createSelector(
  teacherBindData,
  selectTeacherID,
  (state: IBindTeacher[], id: number) => {
    console.log(state);
    const result = state.map((el: IBindTeacher) => {
      if (el.id === id) {
        return el;
      }
    });
    return result;
  }
);
