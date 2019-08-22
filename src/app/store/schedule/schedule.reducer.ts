import { Action, createReducer, on } from '@ngrx/store';
import * as Schedule from './schedule.actions';

export interface State {
  clearedData: object;
  data: object;
}

export const initialState: State = {
  clearedData: null,
  data: null
};

const reducer = createReducer(
  initialState,
  on(Schedule.setClearedSchedule, (state, clearedData) => ({...state, clearedData})),
  on(Schedule.setSchedule, (state, data ) => ({...state, data})),
);

export function scheduleReducer(state: State | undefined, action: Action) {
  return reducer(state, action);
}
