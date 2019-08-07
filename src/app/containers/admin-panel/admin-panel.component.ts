import {Component, OnInit} from '@angular/core';
import {AdminPanelService} from '../../services/admin-panel.service';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {
  chartColorsSelector,
  chartDataSelector,
  chartLabelsSelector, chartLegendSelector,
  chartOptionsSelector,
  chartTypeSelector
} from 'src/app/store/chart/chart.selectors';
import randomC from 'randomcolor';
import ChartObject from '../../models/chartObject.model';

@Component({
  selector: 'webui-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {

  constructor(public panelService: AdminPanelService, private store: Store<{chart}>) { }

  teachers$: Observable<number>;
  subjects$: Observable<number>;
  students$: Observable<number>;
  classes$: Observable<number>;
  data$: Observable<Array<number>>;
  labels$: Observable<Array<string>>;
  colors$: Observable<Array<object>>;
  chartType$: Observable<string>;
  options$: Observable<object>;
  legend$: Observable<boolean>;
  chartObject: ChartObject;

  static getRandomColor(): string {
    return randomC({
      luminosity: 'light',
      format: 'rgba',
      alpha: 0.5
    });
  }

  setClassChart(classNumber) {
    const data: Array<number> = [];
    const labels: Array<string> = [];
    const colors: Array<object> = [{
      backgroundColor: []
    }];
    const httpRef = this.panelService.getStudentsFromClass(classNumber + '')
    .subscribe((value: Array<ChartData>) => {
        value.forEach(dataset => {
          data.push(dataset.data[0]);
          labels.push(dataset.label);
          // @ts-ignore
          colors[0].backgroundColor.push(AdminPanelComponent.getRandomColor());
        });
    },
      (error) => console.log(error),
      () => {
        this.panelService.generateChart(data, labels, colors);
        httpRef.unsubscribe();
    });
  }

  setChartType(value) {
    this.panelService.setChartType(value);
  }


  ngOnInit() {
    this.teachers$ = this.panelService.getTeachersNumber();
    this.subjects$ = this.panelService.getSubjectsNumber();
    this.students$ = this.panelService.getStudentsNumber();
    this.classes$ = this.panelService.getClassesNumber();

    this.setClassChart('11');

    this.colors$ = this.store.select(chartColorsSelector);
    this.data$ = this.store.select(chartDataSelector);
    this.labels$ = this.store.select(chartLabelsSelector);
    this.options$ = this.store.select(chartOptionsSelector);
    this.chartType$ = this.store.select(chartTypeSelector);
    this.legend$ = this.store.select(chartLegendSelector);
    this.chartObject = {
      colors$: this.colors$,
      data$: this.data$,
      labels$: this.labels$,
      options$: this.options$,
      chartType$: this.chartType$,
      legend$: this.legend$
    };

  }


}

interface ChartData {
  data: Array<number>;
  label: string;
}
