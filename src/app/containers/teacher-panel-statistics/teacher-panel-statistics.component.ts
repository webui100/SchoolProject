import { Component, OnInit } from '@angular/core';
import { Store, select } from "@ngrx/store";
import * as _ from 'lodash';
import { selectAllMarks, selectAllStudents } from "../../store/teacher-panel-statistics/teacher-panel-statistics.selector";
import { selectAllJournals } from "../../store/teacher-panel/teacher-panel.selector";
import { TeacherPanelStatisticService } from 'src/app/services/teacher-panel-statistic.service';
import { TeacherJournals } from '../../models/teacher-panel.model';
import { TeacherPanelService } from '../../services/teacher-panel.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  public barChartLabels = ['01.02.19' , '01.02.19', '01.02.19', '01.02.19', '01.02.19', '01.02.19', '01.02.19', '01.02.19' , '01.02.19', '01.02.19', '01.02.19', '01.02.19', '01.02.19', '01.02.19'];
  public barChartData = [{data: [8, 10, 6, 8, 7, 6, 8, 8, 10, 6, 8, 7, 6, 8], label: 'Оцінки за вибраний період'},];
  public barChartType = 'bar';
  public barChartLegend = true;
  public chartData;
  marksData = {
    data: [],
    labels: [],
  };
  //get id
  public selectedClass;
  public onClassSelect(value) {
    this.selectedClass = value;
    this.getStudents(value.idClass);
  };
  public itemOfSubjects;
  public onSubjectSelect(value) {
    console.log(this.itemOfSubjects);
    this.itemOfSubjects = value.idSubject;
    console.log(this.itemOfSubjects);
  }
  public itemOfStudents;
  public onStudentSelect(value) {
    this.itemOfStudents = value.id;//student_id
  }
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
  // Get all marks
  getMarks(): void {
    this.serviceMarksOfStudent.getMarksService(this.itemOfStudents, this.itemOfSubjects);
    this.observableMarks$.subscribe(response => {
      this.marksData = response.data && response;
      // console.log(this.marksData)
    });
      // if (!this.marksData) {
      //   this.serviceMarksOfStudent.getMarksService();
      // }
  }

  ngOnInit() {
    this.getData();
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
      fourthCtrl: ['', Validators.required]
    });
  }
}
