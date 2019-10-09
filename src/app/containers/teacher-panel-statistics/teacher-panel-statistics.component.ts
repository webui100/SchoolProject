import { Component, OnInit } from '@angular/core';
import { Store, select } from "@ngrx/store";
import * as _ from 'lodash';
import { selectAllMarks, selectAllStudents } from "../../store/teacher-panel-statistics/teacher-panel-statistics.selector";
import { selectAllJournals } from "../../store/teacher-panel/teacher-panel.selector";
import { TeacherPanelStatisticService } from 'src/app/services/teacher-panel-statistic.service';
import { TeacherJournals } from '../../models/teacher-panel.model';
import { TeacherPanelService } from '../../services/teacher-panel.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs';

@Component({
  selector: 'webui-teacher-panel-statistics',
  templateUrl: './teacher-panel-statistics.component.html',
  styleUrls: ['./teacher-panel-statistics.component.scss']
})
export class TeacherPanelStatisticsComponent implements OnInit {
  private observableStatistics$: any;
  private observableStudents$: any;
  private observableMarks$: any;

  constructor(
    private serviceOfTeacherJournals: TeacherPanelService,
    private serviceStudents: TeacherPanelStatisticService,
    private serviceMarksOfStudent: TeacherPanelStatisticService,
    private storeJournalsData: Store<{ teacherPanel }>,
    private storeStudentsData: Store<{ teacherPanelStatistics }>,
    private storeMarksData: Store<{ teacherPanelStatistics }>,
    private _formBuilder: FormBuilder,
    public datepipe: DatePipe,
    ) {
      this.observableStatistics$ = this.storeJournalsData.pipe(select(selectAllJournals));
      this.observableStudents$ = this.storeStudentsData.pipe(select(selectAllStudents));
      this.observableMarks$ = this.storeMarksData.pipe(select(selectAllMarks));
    };

  dataFromJournals: TeacherJournals[];
  uniqueSubjectsFromJournals: any;
  dataAboutStudents: any;
  //stepper
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  isLinear = true;
  //chart
  public barChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        gridLines: {
        },
        ticks: {
          min: 0,
          max: 12,
          stepSize: 1
        },
      }]
    }
  };
  public barChartType = 'bar';
  public barChartLegend = true;
  public chartData;
  public marksData = {
    data: [],
    labels: [],
  };
  //get id and name
  //first step
  public selectedClass;
  public onClassSelect(value) {
    this.selectedClass = value;
    this.getStudents(value.idClass);
  };
  //second step
  public idOfSubjects;
  public nameOfSubjects;
  public onSubjectSelect(value) {
    this.idOfSubjects = value.idSubject;
    this.nameOfSubjects = value.subjectName
  };
  //third step
  public idOfStudents;
  public nameOfStudents;
  public onStudentSelect(value) {
    this.idOfStudents = value.id;//student_id
    this.nameOfStudents = value.lastname + " " + value.firstname;
  };
  //average mark
  public averageMark;
  // date
  public dateValueOfStart;
  public dateValueOfEnd;
  public startDate;
  public endDate;
  //unsubscribe
  private cancelSubscription$: Subject<void> = new Subject();

  // Get data for statistics from teacher's active journals
  getData(): void {
    this.observableStatistics$.subscribe(response => {
      this.dataFromJournals = response;
      this.uniqueSubjectsFromJournals = _.uniqBy(response, 'idClass');
    });
      if (!this.dataFromJournals) {
        this.serviceOfTeacherJournals.getTeacherJournalsService();
      }
  }
  // Get students of class
  getStudents(class_id): void {
    this.serviceStudents.getStudentsService(class_id);
    this.observableStudents$.subscribe(response => {
      this.dataAboutStudents = response;
    })
  }
  //date
  transformDate() {
    this.startDate = this.datepipe.transform(this.dateValueOfStart, 'yyyy-MM-dd');
    this.endDate = this.datepipe.transform(this.dateValueOfEnd, 'yyyy-MM-dd');
    if(!this.startDate){
      this.startDate = "1970-01-01";
    }
    if(!this.endDate){
      this.endDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    }
  }
  // Get all marks
  getMarks(): void {
      this.serviceMarksOfStudent.getMarksService(this.idOfStudents, this.idOfSubjects, this.startDate, this.endDate);
      this.observableMarks$
      .pipe(takeUntil(this.cancelSubscription$))
      .subscribe(response => {
        if(response.data[0]){
          this.marksData = response;
          //get average mark
          this.averageMark = this.marksData.data[0].data
          .reduce((a, b)=>(a + b))/this.marksData.data[0].data.length;
        }
    });   
  }
  // Chart
  setInitialDataOfChart(): void {
    this.marksData = {
      data: [{data: [], label: 'Оцінка'}],
      labels: []
    }
    this.cancelSubscription$.next();
  }

  ngOnInit() {
    this.getData();
    this.setInitialDataOfChart();
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });
    this.fourthFormGroup = this._formBuilder.group({
      fourthCtrl: []
    });
  }
}
