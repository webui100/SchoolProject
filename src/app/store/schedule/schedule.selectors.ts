import { createSelector } from '@ngrx/store';

import { State as AppState } from '../index';
import { State as ScheduleState } from './schedule.reducer';

export const selectSchedule = (state: AppState) => state.schedule;

export const selectScheduleId = (state: ScheduleState) => state.id;
// export const selectScheduleData = (state: ScheduleState) => state.data;

export const selectS = createSelector(
  selectSchedule,
  selectScheduleId,
  // selectScheduleData
);
