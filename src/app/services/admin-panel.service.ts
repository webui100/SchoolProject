
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {filter, reduce, switchMap} from 'rxjs/operators';
import {from} from 'rxjs';
import {Store} from '@ngrx/store';
import * as ChartActions from '../store/chart/chart.actions';
import {Chart} from 'chart.js';
import randomC from 'randomcolor';

@Injectable({
  providedIn: 'root'
})
export class AdminPanelService {
  private uri = environment.APIEndpoint;

  constructor(private http: HttpClient, private store: Store<{chart}>) {
  }

  getRandomColor(): string {
    return randomC({
      luminosity: 'light',
      format: 'rgba',
      alpha: 0.5
    });
  }


  generateChart(data: Array<number>, labels: Array<string>, colors: Array<object>) {
    this.store.dispatch(ChartActions.setChartData({data, labels, colors}));
  }

  setChartType(chartType: string) {
    let options: object;
    let legend: boolean;
    switch (chartType) {
      case 'bar':
        legend = false;
        options = {
          scaleShowVerticalLines: false,
          responsive: true,
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                callback(value) {
                  if (value % 1 === 0) {
                    return value;
                  }
                }
              }
            }]
          },
          plugins: {
            datalabels: {
              anchor: 'end',
              align: 'end',
            }
          }
        };
        break;
      case 'pie':
        legend = true;
        options = {
          responsive: true,
          legend: {
            position: 'top',
          },
          plugins: {
            datalabels: {
              formatter: (value, ctx) => {
                return ctx.chart.data.labels[ctx.dataIndex];
              },
            },
          }
        };
        break;
      case 'doughnut':
        legend = true;
        options = {
          responsive: true,
          legend: {
            position: 'top',
          }
        };
        break;
      default:
        options = options = {
          scaleShowVerticalLines: false,
          responsive: true
        };
    }
    this.store.dispatch(ChartActions.setCartType({chartType, options, legend}));
  }

}


interface Response {
  data: Array<object>;
  id: number;
  isActive: boolean;
  numOfStudents: number;
  className: string;
}