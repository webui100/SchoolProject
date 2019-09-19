import { createAction, props } from '@ngrx/store';
import { Chart } from '../../models/chart.model';

export const addChart = createAction(
  '[Chart] new chart',
  props<{ chart: Chart }>()
);

export const setChartData = createAction(
  '[Chart] set chart data',
  props<{ data: Array<number>, labels: Array<string>, colors: Array<object>, year: number }>()
);

export const setCartType = createAction(
  '[Chart] set chart type',
  props<{ chartType: string, options: object, legend: boolean }>()
);

