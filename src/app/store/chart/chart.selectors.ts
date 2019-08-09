import { State as AppState } from '../index';
import { createSelector } from '@ngrx/store';

export const chartSelector = (state: AppState) => state.chart.chart;
