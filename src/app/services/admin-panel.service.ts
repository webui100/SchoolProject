import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as ChartActions from '../store/chart/chart.actions';
import randomC from 'randomcolor';
import { getStudentsFromClass } from '../store/chart/chart.selectors';

@Injectable({
  providedIn: 'root'
})
export class AdminPanelService {

  constructor(private store: Store<{ chart }>) {
  }

  getRandomColor(): string {
    return randomC({
      luminosity: 'light',
      format: 'rgba',
      alpha: 0.5
    });
  }

  setClassChart(className: number) {
    const data: Array<number> = [];
    const labels: Array<string> = [];
    const colors: Array<object> = [{
      backgroundColor: []
    }];
    const studentsSelector$ = this.store.select(getStudentsFromClass, { className })
      .subscribe((value: Array<ChartData>) => {
        value.forEach(dataset => {
          data.push(dataset.data[0]);
          labels.push(dataset.label);
          // @ts-ignore
          colors[0].backgroundColor.push(this.getRandomColor());
        });
      },
        (error) => console.log(error)
      );
    studentsSelector$.unsubscribe();
    this.generateChart(data, labels, colors, className);
  }


  generateChart(data: Array<number>, labels: Array<string>, colors: Array<object>, year: number) {
    this.store.dispatch(ChartActions.setChartData({ data, labels, colors, year }));
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
    this.store.dispatch(ChartActions.setCartType({ chartType, options, legend }));
  }

}



interface ChartData {
  data: Array<number>;
  label: string;
}
