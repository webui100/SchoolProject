import { Component, OnInit, OnDestroy } from '@angular/core';
import { ScheduleService } from 'src/app/services/schedule.service';
import { Store, select } from '@ngrx/store';
import { SubjectsService } from 'src/app/services/subjects.service';
import { ClassesService } from 'src/app/services/classes.service';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import initialSchedule from './initial-schedule';
import { selectAll as selectAllSubjects } from 'src/app/store/subjects/subjects.selector';
import { selectClassesList as selectAllClasses } from 'src/app/store/classes/classes.selector';
import { TeachersService } from 'src/app/services/teachers.service';
import { selectTeachers } from 'src/app/store/teachers/teachers.selector';
import * as ScheduleModels from 'src/app/models/schedule';
import { MAT_DATE_FORMATS } from '@angular/material';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD MMM',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'webui-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})

export class ScheduleComponent implements OnInit, OnDestroy {
  daysOfWeek = initialSchedule;
  scheduleForm: FormGroup;

  subjects: any[];
  subjectsTemp$: any;
  classesTemp$: any;
  teachersTemp$: any;
  teachersSubscription;
  classesSubscription;
  subjectsSubscription;
  terms: string[] = ['1', '2', '1 - 2'];
  defaultDates: ScheduleModels.DafaultTermDates;
  showStartEndDates = false;
  classes: any = [];
  years: number[] = [];
  filteredTerm: Observable<string[]>;
  filteredClasses: Observable<string[]>;
  filteredYears: Observable<string[]>;

  constructor(private formBuilder: FormBuilder,
              private schedule: ScheduleService,
              private subjectsObj: SubjectsService,
              private classesObj: ClassesService,
              private teachersObj: TeachersService,
              private storeSubjects: Store<{ subjects }>,
              private storeClasses: Store<{ classes }>,
              private storeTeachers: Store<{ teachers }>
  ) {
    this.subjectsTemp$ = this.storeSubjects.pipe(select(selectAllSubjects));
    this.classesTemp$ = this.storeClasses.pipe(select(selectAllClasses));
    this.teachersTemp$ = this.storeTeachers.pipe(select(selectTeachers));
  }

  ngOnInit() {
    this.buildScheduleForm();

    this.subjectsSubscription = this.subjectsTemp$.subscribe(res => {
      if (!res) {
        this.subjectsObj.getSubjects();
      }
    }
    );

    this.classesSubscription = this.classesTemp$.subscribe(res => {
      if (!res) {
        this.classesObj.getClasses();
      }
      for (const item in res) {
        if (res[item].isActive) {
          this.classes.push(res[item]);
        }
      }
    });

    this.teachersSubscription = this.teachersTemp$.subscribe(response => {
      const res = response.teachersList;
      if (!res) {
        this.teachersObj.getTeachers();
      }
    });

    // this.schedule.getSchedule(this.scheduleForm.get('class').value.id);

    if (!this.years.length) {
      this.years = this.schedule.createYearsList();
    }

    this.filteredTerm = this.scheduleForm.get('term').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value, this.terms))
      );
    this.filteredClasses = this.scheduleForm.get('class').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterClasses(value.toString(), this.classes))
      );
    this.filteredYears = this.scheduleForm.get('year').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value.toString(), this.years))
      );
  }

  displayFn(classItem?: any): string | undefined {
    return classItem ? classItem.className : undefined;
  }

  private _filter(value: string, arr: any[]): string[] {
    const filterValue = value.toLowerCase();
    if (typeof (arr[0]) === 'number') {
      arr.map((item, index) => arr[index] = item.toString());
    }
    return arr.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterClasses(value: string, arr: any[]): string[] {
    const filterValue = value.toLowerCase();
    return arr.filter(option => option.className.toLowerCase().includes(filterValue));
  }

  buildScheduleForm(): void {
    this.scheduleForm = this.formBuilder.group({
      term: this.formBuilder.control({value: '', disabled: true}, [Validators.required]),
      class: this.formBuilder.control('', [Validators.required]),
      year: this.formBuilder.control('', [Validators.required]),
      termStartDate: this.formBuilder.control(''),
      termEndDate: this.formBuilder.control(''),
      scheduleForWeek: this.formBuilder.group({
        monday: this.formBuilder.array([]),
        tuesday: this.formBuilder.array([]),
        wednesday: this.formBuilder.array([]),
        thursday: this.formBuilder.array([]),
        friday: this.formBuilder.array([]),
        saturday: this.formBuilder.array([]),
      }),
    });
    }

  onSubmit() {
    this.schedule.postSchedule(this.scheduleForm.value);
    this.schedule.postTeacherToJournal(this.scheduleForm.value);
  }

  enableTermInput() {
    this.scheduleForm.get('term').enable();
  }

  addStartEndDates() {
    this.defaultDates = this.schedule.getDafaultDates(this.scheduleForm.get('term').value);
    this.scheduleForm.get('termStartDate').patchValue(this.defaultDates.start);
    this.scheduleForm.get('termEndDate').patchValue(this.defaultDates.end);
    this.showStartEndDates = true;
    // console.log(this.scheduleForm)
  }

  clearSchedule() {
    Object.keys((this.scheduleForm.get('scheduleForWeek') as FormGroup).controls).forEach(key => {
      while ((this.scheduleForm.get('scheduleForWeek').get(key) as FormArray).length > 1) {
        (this.scheduleForm.get('scheduleForWeek').get(key) as FormArray).removeAt(0);
      }
    });
  }

  ngOnDestroy() {
    this.teachersSubscription.unsubscribe();
    this.classesSubscription.unsubscribe();
    this.subjectsSubscription.unsubscribe();
  }
}
