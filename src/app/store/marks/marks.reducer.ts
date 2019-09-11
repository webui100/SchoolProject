import { Action, createReducer, on } from '@ngrx/store';
import * as MarksData from './marks.action';
import { IMarkType } from '../../models/mark-type.model';

export interface State {
  marksList: IMarkType[];
}

export const initialState: State = {
  marksList: []
};

const reducer = createReducer(
  initialState,
  on(MarksData.marksListAction, (state: State, { marksList }) => ({
    ...state,
    marksList
  }))
);

export function marksReducer(state: State | undefined, action: Action): State {
    return reducer(state, action);
  }

