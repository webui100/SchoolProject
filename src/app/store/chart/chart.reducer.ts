import { Action, createReducer, on } from '@ngrx/store';
import * as ChartActions from './chart.actions';
import {Chart} from '../../models/chart.model';


// tslint:disable-next-line:no-empty-interface
export interface State extends Chart {}

export const initialState: State = {
    labels: [''],
    options: {
      scaleShowVerticalLines: false,
      responsive: true,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            callback(value) {if (value % 1 === 0) {return value; }}
          }
        }]
      },
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'end',
        }
      }
    },
    type: 'bar',
    data: [0],
    legend: false,
    colors: [
      {
        backgroundColor: [],
      },
    ]
};

const reducer = createReducer(
  initialState,
  on(ChartActions.addChart, (state, { chart }) => ({
    ...state,
    chart
  })),
  on(ChartActions.setChartData, (state, {data, labels, colors}) => ({
    ...state,
    data,
    labels,
    colors
  })),
  on(ChartActions.setCartType, (state, {chartType, options, legend}) => ({
    ...state,
    options,
    legend,
    type: chartType
  }))
);

export function chartReducer(state: State | undefined, action: Action) {
  return reducer(state, action);
}
