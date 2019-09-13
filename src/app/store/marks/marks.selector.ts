import { IMarkType } from './../../models/mark-type.model';
import { State as AppState } from '../index';
import { createSelector } from '@ngrx/store';

export const selectMarks = (state: AppState) => state.marks.marksList;


export const activeMark = (active: boolean) => createSelector(
    selectMarks,
    (state: IMarkType[]) => {
        if (state) {
            return [...state].filter( (el: IMarkType) => {
                return el.active === active;
            });
        }
    }
)


export const marksSortByName = (active: boolean) =>  createSelector(
    activeMark(active),
    (state: IMarkType[]) => {
      if (state) {
        return [...state].sort((a: IMarkType, b: IMarkType): number => {
          return a.markType .localeCompare(b.markType);
        });
      }
    }
  );
