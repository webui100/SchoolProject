import {Component, OnDestroy, OnInit} from '@angular/core';
import {AdminPanelService} from '../../services/admin-panel.service';
import {Observable, Subject, Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import {Chart} from '../../models/chart.model';
import {
  chartSelector,
  getStudentsFromClass,
  selectQuantityTSC,
  selectActiveClasses
} from 'src/app/store/chart/chart.selectors';
import {TeachersService} from '../../services/teachers.service';
import {ClassesService} from '../../services/classes.service';
import {SubjectsService} from '../../services/subjects.service';
import {QtObj} from '../../models/quantityObj.model';

@Component({
  selector: 'webui-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit, OnDestroy {

  constructor(public panelService: AdminPanelService, private store: Store<{chart}>,
              private teachersService: TeachersService,
              private classesService: ClassesService,
              private subjectsService: SubjectsService) {

  }

  quantityObj$: Observable<QtObj>;
  chart$: Observable<Chart>;
  chartTypeListener$ = new Subject<string>();
  studentsSelector$: Subscription;



  setClassChart(className) {
    const data: Array<number> = [];
    const labels: Array<string> = [];
    const colors: Array<object> = [{
      backgroundColor: []
    }];
    this.studentsSelector$ = this.store.select(getStudentsFromClass, {className})
    .subscribe((value: Array<ChartData>) => {
        value.forEach(dataset => {
          data.push(dataset.data[0]);
          labels.push(dataset.label);
          // @ts-ignore
          colors[0].backgroundColor.push(this.panelService.getRandomColor());
        });
      },
      (error) => console.log(error)
    );
    this.studentsSelector$.unsubscribe();
    this.panelService.generateChart(data, labels, colors);
  }


  ngOnInit() {

    this.teachersService.getTeachers();
    this.subjectsService.getSubjects();
    this.classesService.getClasses();
    let classesIsExist = false;
    let selectActiveRef: Subscription;
    selectActiveRef = this.store.select(selectActiveClasses).subscribe(value => {
        if (value.length > 0) {
          classesIsExist = true;
        }
        if (classesIsExist && selectActiveRef) {
          this.setClassChart(11);
          selectActiveRef.unsubscribe();
        }
      }
    );

    this.chartTypeListener$.subscribe(value => this.panelService.setChartType(value));

    this.quantityObj$ = this.store.select(selectQuantityTSC);

    this.chart$ = this.store.select(chartSelector);

  }

  ngOnDestroy() {
    this.chartTypeListener$.unsubscribe();

  }


}

interface ChartData {
  data: Array<number>;
  label: string;
}


