import { Component, OnInit } from '@angular/core';
import { ScheduleService } from 'src/app/services/schedule.service';
import { Store, select } from '@ngrx/store';
import { SubjectsService } from 'src/app/services/subjects.service';
import { ClassesService } from 'src/app/services/classes.service';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import initialSchedule from './initial-schedule';
import { selectAll as selectAllSubjects } from 'src/app/store/subjects/subjects.selector';
import { selectClassesList as selectAllClasses } from 'src/app/store/classes/classes.selector';
import { TeachersService } from 'src/app/services/teachers.service';
import { selectTeachers } from 'src/app/store/teachers/teachers.selector';

@Component({
  selector: 'webui-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  daysOfWeek = initialSchedule;
  scheduleForm: FormGroup;

  subjects: any[];
  subjectsTemp$: any;
  classesTemp$: any;
  teachersTemp$: any;
  terms: string[] = ['1', '2'];
  classes: any = [];
  years: number[] = [];
  currentYear = (new Date()).getFullYear();
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

    this.subjectsTemp$.subscribe(res => {
      if (!res) {
        this.subjectsObj.getSubjects();
      }
    }
    );

    this.classesTemp$.subscribe(res => {
      if (!res) {
        this.classesObj.getClasses();
      }
      for (const item in res) {
        if (res[item].isActive) {
          this.classes.push(res[item]);
        }
      }
    });

    this.teachersTemp$.subscribe(response => {
      const res = response.teachersList;
      if (!res) {
        this.teachersObj.getTeachers();
      }
    });

    // this.schedule.getSchedule(16);
    
    if (!this.years.length) {
      for (let i = 0; i <= 3; i++) {
        this.years.push((this.currentYear + i));
      }
    }

    this.filteredTerm = this.scheduleForm.get('term').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value, this.terms))
      );
    this.filteredClasses = this.scheduleForm.get('class').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterClasses(value, this.classes))
      );
    this.filteredYears = this.scheduleForm.get('year').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value.toString(), this.years))
      );
  }

  // displayFn(user?: string): string | undefined {
  //   return user ? user : undefined;
  // }

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
      term: this.formBuilder.control(''),
      class: this.formBuilder.control(''),
      year: this.formBuilder.control(''),
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
    console.log(this.scheduleForm.value);
  }
}
