import { Component, OnInit, OnDestroy } from '@angular/core';
import { ScheduleService } from 'src/app/services/schedule.service';
import { Store, select } from '@ngrx/store';
import { SubjectsService } from 'src/app/services/subjects.service';
import { ClassesService } from 'src/app/services/classes.service';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import initialSchedule from './initial-schedule';
import { selectAll as selectAllSubjects } from 'src/app/store/subjects/subjects.selector';
import { selectClassesList as selectAllClasses } from 'src/app/store/classes/classes.selector';
import { selectTeachers } from 'src/app/store/teachers/teachers.selector';
import { selectScheduleData, selectClearedScheduleData } from 'src/app/store/schedule/schedule.selectors';
import { TeachersService } from 'src/app/services/teachers.service';
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
  restoredScheduleTemp$: any;
  restoredClearedScheduleTemp$: any;
  teachersSubscription;
  classesSubscription;
  subjectsSubscription;
  restoredScheduleSubscriptions;
  restoredClearedScheduleSubscriptions;
  formChangesSubscription;
  terms: string[] = ['1', '2', '1 - 2'];
  defaultDates: ScheduleModels.DafaultTermDates;
  showStartEndDates = false;с
  scheduleCleared = {
    isCleared: false,
    clearingTime: null
  };
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
    private storeTeachers: Store<{ teachers }>,
    private storeSchedule: Store<{ schedule }>
  ) {
    this.subjectsTemp$ = this.storeSubjects.pipe(select(selectAllSubjects));
    this.classesTemp$ = this.storeClasses.pipe(select(selectAllClasses));
    this.teachersTemp$ = this.storeTeachers.pipe(select(selectTeachers));
    this.restoredScheduleTemp$ = this.storeSchedule.pipe(select(selectScheduleData));
    this.restoredClearedScheduleTemp$ = this.storeSchedule.pipe(select(selectClearedScheduleData));
  }

  ngOnInit() {
    this.buildScheduleForm();

    this.getClassesYearsSubjectsTeachersLists();
    
    this.setClassYearTermAutocompleteFilters();

    this.restoredScheduleSubscriptions = this.restoredScheduleTemp$.subscribe(val => {
      let isAnyLesson = false;
      if (val) {
        Object.keys(val.scheduleForWeek).forEach(key => {
          for (const lesson of val.scheduleForWeek[key]) {
            if (lesson.firstGroup) {
              isAnyLesson = true
            }
          }
        });
      }
      if (val && isAnyLesson) {
        this.restoreSchedule(val, 1);
      }

    });
    this.restoredScheduleSubscriptions.unsubscribe();

    this.restoredClearedScheduleSubscriptions = this.restoredClearedScheduleTemp$.subscribe(val => {
      if (val) {
        this.scheduleCleared.isCleared = true
      };
    });

    this.formChangesSubscription = this.scheduleForm.valueChanges
      .pipe(debounceTime(800))
      .subscribe(() => this.schedule.setScheduleToStore(this.scheduleForm.value));

    // this.schedule.getSchedule(this.scheduleForm.get('class').value.id);
  }

  buildScheduleForm(): void {
    this.scheduleForm = this.formBuilder.group({
      term: this.formBuilder.control({ value: '', disabled: true }, [Validators.required]),
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

  clearSchedule(): void {
    this.schedule.setClearedScheduleToStore(this.scheduleForm.value);

    Object.keys((this.scheduleForm.get('scheduleForWeek') as FormGroup).controls).forEach(key => {
      while ((this.scheduleForm.get('scheduleForWeek').get(key) as FormArray).length > 1) {
        (this.scheduleForm.get('scheduleForWeek').get(key) as FormArray).removeAt(0);
      }
    });

    this.scheduleCleared = {
      isCleared: true,
      clearingTime: new Date()
    };
  }

  restoreClearedSchedule(): void {
    this.restoredClearedScheduleSubscriptions = this.restoredClearedScheduleTemp$.subscribe(val => {
      if (val) {
        this.restoreSchedule(val, 0)
      };
    });
  }

  restoreSchedule(val, index: number): void {
    this.scheduleForm.get('term').patchValue(val.term || '');
    this.scheduleForm.get('class').patchValue(val.class || '');
    this.scheduleForm.get('year').patchValue(val.year || '');
    this.scheduleForm.get('termStartDate').patchValue(val.termStartDate || '');
    this.scheduleForm.get('termEndDate').patchValue(val.termEndDate || '');
    Object.keys(this.scheduleForm.get('scheduleForWeek').value).forEach(day => {
      (this.scheduleForm.get('scheduleForWeek').get(day)as FormArray).clear();
      for (let i = 0; i < val.scheduleForWeek[day].length - index; i++) {
        if (day !== 'saturday') {
          (this.scheduleForm.get('scheduleForWeek').get(day)as FormArray).push(this.formBuilder.group({
            firstGroup: this.formBuilder.control(val.scheduleForWeek[day][i].firstGroup, [Validators.required]),
            firstGroupTeacher: this.formBuilder.control(val.scheduleForWeek[day][i].firstGroupTeacher),
            secondGroup: this.formBuilder.control(val.scheduleForWeek[day][i].secondGroup),
            secondGroupTeacher: this.formBuilder.control(val.scheduleForWeek[day][i].secondGroupTeacher)
          }));
        } else {
          (this.scheduleForm.get('scheduleForWeek').get(day)as FormArray).push(this.formBuilder.group({
            firstGroup: this.formBuilder.control(val.scheduleForWeek[day][i].firstGroup),
            secondGroup: this.formBuilder.control(val.scheduleForWeek[day][i].firstGroupTeacher),
            firstGroupTeacher: this.formBuilder.control(val.scheduleForWeek[day][i].secondGroup),
            secondGroupTeacher: this.formBuilder.control(val.scheduleForWeek[day][i].secondGroupTeacher)
          }));
        }
      }
    });
    if (this.restoredClearedScheduleSubscriptions) {
      this.restoredClearedScheduleSubscriptions.unsubscribe();
    };
    if (this.restoredScheduleSubscriptions) {
      console.log('index - ',index)
      // this.restoredScheduleSubscriptions.unsubscribe();
    }

    // if (val.term) this.showStartEndDates = true
  }

  addStartEndDates(): void {
    this.defaultDates = this.schedule.getDafaultDates(this.scheduleForm.get('term').value);
    this.scheduleForm.get('termStartDate').patchValue(this.defaultDates.start);
    this.scheduleForm.get('termEndDate').patchValue(this.defaultDates.end);
    this.showStartEndDates = true;
  }

  onSubmit(): void {
    this.schedule.postSchedule(this.scheduleForm.value);
    this.schedule.postTeacherToJournal(this.scheduleForm.value);
  }

  ngOnDestroy(): void {
    this.teachersSubscription.unsubscribe();
    this.classesSubscription.unsubscribe();
    this.subjectsSubscription.unsubscribe();
    this.formChangesSubscription.unsubscribe();
  }

  displayFn(classItem?: any): string | undefined {
    return classItem ? classItem.className : undefined;
  }

  getClassesYearsSubjectsTeachersLists(): void {
    this.subjectsSubscription = this.subjectsTemp$.subscribe(res => {
      if (!res) {
        this.subjectsObj.getSubjects();
      }
    });

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
    
    if (!this.years.length) {
      this.years = this.schedule.createYearsList();
    }
  }

  setClassYearTermAutocompleteFilters(): void {
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

  enableTermInput(): void {
    this.scheduleForm.get('term').enable();
  }
}
