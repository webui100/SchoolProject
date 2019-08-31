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
import { selectScheduleData,
  selectClearedScheduleData,
  selectSavedScheduleData } from 'src/app/store/schedule/schedule.selectors';
import { TeachersService } from 'src/app/services/teachers.service';
import * as ScheduleModels from 'src/app/models/schedule';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { listValidation } from './validators.directive';

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
    { provide: MAT_DATE_LOCALE, useValue: 'uk-UA' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
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
  restoredSavedScheduleTemp$: any;
  teachersSubscription;
  classesSubscription;
  subjectsSubscription;
  restoredScheduleSubscriptions;
  restoredClearedScheduleSubscriptions;
  restoredSavedScheduleSubscriptions;
  formChangesSubscription;
  terms: string[] = ['1', '2', '1 - 2'];
  defaultDates: ScheduleModels.DafaultTermDates;
  showStartEndDates = false;
  scheduleCleared = {
    isCleared: false,
    clearingTime: null
  };
  scheduleSaved = {
    isSaved: false,
    savingTime: null
  };
  classes: any = [];
  year: number;
  isClassValid = true;
  isTermValid = true;
  isDayValid = {};
  filteredTerm: Observable<string[]>;
  filteredClasses: Observable<string[]>;
  // filteredYears: Observable<string[]>;

  constructor(
    private formBuilder: FormBuilder,
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
    this.restoredSavedScheduleTemp$ = this.storeSchedule.pipe(select(selectSavedScheduleData));
  }

  ngOnInit() {
    this.scheduleForm = this.schedule.buildScheduleForm(this.terms, this.classes);

    this.getClassesList();
    this.getYear();
    this.getSubjectsList();
    this.getTeachersList();
    
    this.setClassYearTermAutocompleteFilters();

    this.checkForScheduleRestoration();

    this.setFormChangesSubscription();

    initialSchedule.forEach(day => this.isDayValid[day.name] = true);

    // this.schedule.getSchedule(this.scheduleForm.get('class').value.id);
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

  restoreSavedSchedule(): void {
    this.restoredSavedScheduleSubscriptions = this.restoredSavedScheduleTemp$.subscribe(val => {
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

    if (val.term) {
      this.defaultDates = this.schedule.getDafaultDates(this.scheduleForm.get('term').value);
      this.showStartEndDates = true;
    }

    if (this.restoredClearedScheduleSubscriptions) {
      this.restoredClearedScheduleSubscriptions.unsubscribe();
    };
    if (this.restoredSavedScheduleSubscriptions) {
      this.restoredSavedScheduleSubscriptions.unsubscribe();
    };

    // if (val.term) this.showStartEndDates = true
  }

  addStartEndDates(): void {
    this.defaultDates = this.schedule.getDafaultDates(this.scheduleForm.get('term').value);
    this.scheduleForm.get('termStartDate').patchValue(this.defaultDates.start);
    this.scheduleForm.get('termEndDate').patchValue(this.defaultDates.end);
    this.showStartEndDates = true;
  }

  onSubmit(): void {
    if (this.scheduleForm.valid) {
      this.schedule.postSchedule(this.scheduleForm.value);
      this.schedule.postTeacherToJournal(this.scheduleForm.value);
  
      this.scheduleSaved = {
        isSaved: true,
        savingTime: new Date()
      };
    } else {
      this.chechForValidity()
    }
  }

  chechForValidity() {
    this.isClassValid = this.scheduleForm.get('class').valid ? true : false;
    this.isTermValid = this.scheduleForm.get('term').valid ? true : false;
    Object.keys(this.isDayValid).forEach(day => {
      this.isDayValid[day] = this.scheduleForm.get('scheduleForWeek').get(day).valid ? true : false;
    })
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

  getSubjectsList(): void {
    this.subjectsSubscription = this.subjectsTemp$.subscribe(res => {
      if (!res) {
        this.subjectsObj.getSubjects();
      }
    });
  }

  getClassesList(): void {
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
  }
  
  getTeachersList(): void {
    this.teachersSubscription = this.teachersTemp$.subscribe(response => {
      if (!response) {
        this.teachersObj.getTeachers();
      }
    });
  }
  
  getYear(): void {
      this.year = this.schedule.createYear();
      this.scheduleForm.get('year').patchValue(this.year);
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
  // this.filteredYears = this.scheduleForm.get('year').valueChanges
  //   .pipe(
  //     startWith(''),
  //     map(value => this._filter(value.toString(), this.years))
  //   );
  }

  checkForScheduleRestoration() {
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
  }

  setFormChangesSubscription() {
    this.formChangesSubscription = this.scheduleForm.valueChanges
    .pipe(debounceTime(800))
    .subscribe(() => this.schedule.setScheduleToStore(this.scheduleForm.value));
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

  // enableTermInput(): void {
  //   this.scheduleForm.get('term').enable();
  // }
}
