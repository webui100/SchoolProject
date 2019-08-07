import { Action, createReducer, on } from '@ngrx/store';
import * as Schedule from './schedule.actions';

export interface State {
  id: number;
  data: Array<object>;
}

export const initialState: State = {
  id: null,
  data: null
};

const reducer = createReducer(
  initialState,
  on(Schedule.getSchedule, (state, { id }) => {
    console.log(id, state, {...state, id});
    return ({
    ...state,
    id
  });
})
);

export function scheduleReducer(state: State | undefined, action: Action) {
  return reducer(state, action);
}
