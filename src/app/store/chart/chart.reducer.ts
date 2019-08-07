import { Action, createReducer, on } from '@ngrx/store';
import * as ChartActions from './chart.actions';
import {Chart} from '../../models/chart.model';


export interface State {
  chart: Chart;
}

export const initialState: State = {
  chart: {
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
  }
};

const reducer = createReducer(
  initialState,
  on(ChartActions.addChart, (state, { chart }) => ({
    ...state,
    chart
  })),
  on(ChartActions.setChartData, (state, {data, labels, colors}) => ({
    ...state,
    chart: {
      data,
      labels,
      options: state.chart.options,
      type: state.chart.type,
      legend: state.chart.legend,
      colors
    }
  })),
  on(ChartActions.setCartType, (state, {chartType, options, legend}) => ({
    ...state,
    chart: {
      data: state.chart.data,
      labels: state.chart.labels,
      options,
      type: chartType,
      legend,
      colors: state.chart.colors
    }
  }))
);

export function chartReducer(state: State | undefined, action: Action) {
  return reducer(state, action);
}
