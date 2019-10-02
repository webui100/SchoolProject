import { Action, createReducer, on } from "@ngrx/store";
import * as ClassData from "./classes.action";
import ClassModel from "src/app/models/schoolclass.model";

export interface State {
  classesList: Array<object>;
}

export const initialState: State = {
  classesList: []
};
const reducer = createReducer(
  initialState,
  on(ClassData.getClassAction, (state: State, { classesList }) => ({
    ...state,
    classesList
  })),
  on(ClassData.addClassAction, (state: State, { newClass }) => ({
    ...state,
    classesList: [...state.classesList, newClass]
  })),
  on(ClassData.editClassAction, (state: State, { editClass }) => ({
    ...state,
    classesList: state.classesList.map((currentClass: ClassModel) => {
      if (currentClass.id === editClass.id) {
        return editClass;
      } else {
        return currentClass;
      }
    })
  }))
);

export function classesReducer(state: State | undefined, action: Action) {
  return reducer(state, action);
}
