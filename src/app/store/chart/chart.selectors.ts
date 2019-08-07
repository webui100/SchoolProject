import { State as AppState } from '../index';
import { createSelector } from '@ngrx/store';

export const chartSelector = (state: AppState) => state.chart;

export const chartDataSelector = (state: AppState) => state.chart.chart.data;

export const chartTypeSelector = (state: AppState) => state.chart.chart.type;

export const chartLabelsSelector = (state: AppState) => state.chart.chart.labels;

export const chartColorsSelector = (state: AppState) => state.chart.chart.colors;

export const chartOptionsSelector = (state: AppState) => state.chart.chart.options;

export const chartLegendSelector = (state: AppState) => state.chart.chart.legend;
