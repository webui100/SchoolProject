import { State as AppState } from '../index';

export const selectScheduleData = (state: AppState) => state.schedule.data;
export const selectClearedScheduleData = (state: AppState) => state.schedule.clearedData;
export const selectSavedScheduleData = (state: AppState) => state.schedule.savedData;
