import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminPanelService } from '../../services/admin-panel.service';
import { Observable, Subject, Subscription, ReplaySubject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Chart } from '../../models/chart.model';
import {
  chartSelector,
  getStudentsFromClass,
  selectQuantityTSC,
  selectActiveClasses
} from 'src/app/store/chart/chart.selectors';
import { TeachersService } from '../../services/teachers.service';
import { ClassesService } from '../../services/classes.service';
import { SubjectsService } from '../../services/subjects.service';
import { QtObj } from '../../models/quantityObj.model';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'webui-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit, OnDestroy {

  constructor(public panelService: AdminPanelService, private store: Store<{ chart }>,
    private teachersService: TeachersService,
    private classesService: ClassesService,
    private subjectsService: SubjectsService) {

  }

  quantityObj$: Observable<QtObj>;
  chart$: Observable<Chart>;
  chartTypeListener$ = new Subject<string>();
  studentsSelector$: Subscription;
  private destroy$: ReplaySubject<boolean> = new ReplaySubject(1);



  setClassChart(className) {
    const data: Array<number> = [];
    const labels: Array<string> = [];
    const colors: Array<object> = [{
      backgroundColor: []
    }];
    this.studentsSelector$ = this.store.select(getStudentsFromClass, { className })
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
    this.store.select(selectActiveClasses).pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      if (value.length > 0) {
        classesIsExist = true;
      }
      if (classesIsExist && selectActiveRef) {
        this.setClassChart(11);
        selectActiveRef.unsubscribe();
      }
    }
    );

    this.chartTypeListener$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => this.panelService.setChartType(value));

    this.quantityObj$ = this.store.pipe(
      select(selectQuantityTSC),
      takeUntil(this.destroy$)
    );

    this.chart$ = this.store.pipe(
      select(chartSelector),
      takeUntil(this.destroy$)
    );

  }

  ngOnDestroy() {
    this.destroy$.next(true);

    this.destroy$.unsubscribe();

  }


}

interface ChartData {
  data: Array<number>;
  label: string;
}


