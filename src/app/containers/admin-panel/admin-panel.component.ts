import {Component, OnInit} from '@angular/core';
import {AdminPanelService} from '../../services/admin-panel.service';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {Chart} from '../../models/chart.model';
import {
  chartSelector
} from 'src/app/store/chart/chart.selectors';
import randomC from 'randomcolor';

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

  chart$: Observable<Chart>;

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

    this.chart$ = this.store.select(chartSelector);

  }


}

interface ChartData {
  data: Array<number>;
  label: string;
}
