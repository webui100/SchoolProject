import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminPanelService } from '../../services/admin-panel.service';
import { Observable, Subject, Subscription, ReplaySubject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Chart } from '../../models/chart.model';
import {
  chartSelector,
  getStudentsFromClass,
  selectQuantityTSC,
  selectActiveClasses,
  selectChartYear,
  selectChartType
} from 'src/app/store/chart/chart.selectors';
import { TeachersService } from '../../services/teachers.service';
import { ClassesService } from '../../services/classes.service';
import { SubjectsService } from '../../services/subjects.service';
import { QtObj } from '../../models/quantityObj.model';
import { takeUntil, map, take } from 'rxjs/operators';

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
  private destroy$: ReplaySubject<boolean> = new ReplaySubject(1);
  public year: number;
  public chartType: string;


  ngOnInit() {

    this.store.pipe(
      select(selectChartYear),
      take(1),
      takeUntil(this.destroy$),
    ).subscribe((year) => this.year = year);

    this.store.pipe(
      select(selectChartType),
      take(1),
      takeUntil(this.destroy$),
    ).subscribe((chartType) => this.chartType = chartType);


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

    this.initializeInfo();

  }

  ngOnDestroy() {
    this.destroy$.next(true);

    this.destroy$.unsubscribe();

  }

  initializeInfo() {
    const selectRef = this.quantityObj$.subscribe((resValue) => {
      if (!resValue.classes) {
        this.classesService.getClasses();
      };
      if (!resValue.subjects) {
        this.subjectsService.getSubjects();
      };
      if (!resValue.teachers) {
        this.teachersService.getTeachers();
      };
    });

    const selectChartRef = this.store.pipe(
      select(chartSelector),
      map((chartObj: Chart) => chartObj.labels[0])
    ).subscribe((label: string) => {
      if (!label) {
        this.panelService.setClassChart(8);
      }
    })

    selectRef.unsubscribe();
    selectChartRef.unsubscribe();
  };

  setClassChart(className: number) {
    this.panelService.setClassChart(className);
  }


}



