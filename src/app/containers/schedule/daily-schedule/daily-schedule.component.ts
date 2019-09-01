import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { selectTeachers } from 'src/app/store/teachers/teachers.selector';
import { selectAll as selectAllSubjects } from 'src/app/store/subjects/subjects.selector';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { listValidation } from 'src/app/containers/schedule/validators.directive';

@Component({
  selector: 'webui-daily-schedule',
  templateUrl: './daily-schedule.component.html',
  styleUrls: ['./daily-schedule.component.scss']
})
export class DailyScheduleComponent implements OnInit, OnDestroy {
  secondGroupVisible: boolean[] = [];
  firstGroupTeachersVisible: boolean[] = [];
  secondGroupTeachersVisible: boolean[] = [];

  teachers: object[] = [];
  subjects: object[] = [];
  teachersTemp$: any;
  subjectsTemp$: any;
  subjectsSubscription;
  teachersSubscription;
  filteredTeachersFirstGroup: Observable<string[]>;
  filteredTeachersSecondGroup: Observable<string[]>;
  filteredSubjectsFirstGroup: Observable<string[]>;
  filteredSubjectsSecondGroup: Observable<string[]>;

  lessonsMaxPerDay = 8;
  saturdayFirstLesson = false;

  @Input() public dailySchedule: FormArray;
  @Input() public dayName: string;

  constructor(private formBuilder: FormBuilder,
    private storeSubjects: Store<{ subjects }>,
    private storeTeachers: Store<{ teachers }>) {
    this.teachersTemp$ = this.storeTeachers.pipe(select(selectTeachers));
    this.subjectsTemp$ = this.storeSubjects.pipe(select(selectAllSubjects));
  }

  ngOnInit() {
    this.buildDailySchedule();

    this.teachersSubscription = this.teachersTemp$.subscribe(res => {
      for (const key in res) {
        if (res.hasOwnProperty(key)) {
          const teacher = res[key];
          this.teachers.push({
            fullName: `${teacher.lastname} ${teacher.firstname} ${teacher.patronymic}`,
            id: teacher.id
          });
        }
      }
    });

    this.subjectsSubscription = this.subjectsTemp$.subscribe(res => {
      for (const key in res) {
        if (res.hasOwnProperty(key)) {
          this.subjects.push(res[key]);
        }
      }
    });

    for (let i = 0; i < this.lessonsMaxPerDay; i++) {
      this.secondGroupVisible.push(false);
    }
  }

  buildDailySchedule() {
    if (this.dayName !== 'saturday') {
      this.dailySchedule.push(this.formBuilder.group({
        firstGroup: this.formBuilder.control('', [Validators.required, listValidation(this.subjects)]),
        secondGroup: this.formBuilder.control('', [listValidation(this.subjects)]),
        firstGroupTeacher: this.formBuilder.control('', [listValidation(this.teachers)]),
        secondGroupTeacher: this.formBuilder.control('', [listValidation(this.teachers)])
      }));
    } else {
      this.dailySchedule.push(this.formBuilder.group({
        firstGroup: this.formBuilder.control('', [listValidation(this.subjects)]),
        secondGroup: this.formBuilder.control('', [listValidation(this.subjects)]),
        firstGroupTeacher: this.formBuilder.control('', [listValidation(this.teachers)]),
        secondGroupTeacher: this.formBuilder.control('', [listValidation(this.teachers)])
      }));
    }

      this.setSubjectAutocompleteFirstGroup(0);
  }

  addLesson(lessonNumber: number) {
    if (lessonNumber < (this.lessonsMaxPerDay - 1) &&
      this.dailySchedule.length === lessonNumber + 1) {
      this.dailySchedule.push(this.formBuilder.group({
        firstGroup: this.formBuilder.control('', [listValidation(this.subjects)]),
        secondGroup: this.formBuilder.control('', [listValidation(this.subjects)]),
        firstGroupTeacher: this.formBuilder.control('', [listValidation(this.teachers)]),
        secondGroupTeacher: this.formBuilder.control('', [listValidation(this.teachers)])
      }));

      this.setSubjectAutocompleteFirstGroup(lessonNumber + 1);
    };

    if (this.dayName === 'saturday' && this.dailySchedule.length) {
      this.saturdayFirstLesson = true;
    }
  }

  removeLesson(lessonNumber: number) {
    this.dailySchedule.removeAt(lessonNumber);
    this.removeSecondGroup(lessonNumber);
    this.removeTeacher(lessonNumber, 'first');
    this.removeTeacher(lessonNumber, 'second');
    if (lessonNumber === (this.lessonsMaxPerDay - 1) ||
      (lessonNumber < (this.lessonsMaxPerDay - 1) &&
        this.dailySchedule.length === this.lessonsMaxPerDay - 1)) {
      this.addLesson(this.lessonsMaxPerDay - 2);
    };

    if (this.dayName === 'saturday' &&
          lessonNumber === 0  &&
          !this.dailySchedule.length) {
      this.saturdayFirstLesson = false
    }
  }

  addSecondGroup(lessonNumber: number): void {
    this.secondGroupVisible[lessonNumber] = true;

    this.setSubjectAutocompleteSecondGroup(lessonNumber);
  }

  removeSecondGroup(lessonNumber: number) {
    this.secondGroupVisible[lessonNumber] = false;
    this.secondGroupTeachersVisible[lessonNumber] = false;
    this.dailySchedule.at(lessonNumber).get('secondGroup').patchValue('');
    this.dailySchedule.at(lessonNumber).get('secondGroupTeacher').patchValue('');
  }

  addTeacherToLesson(lessonNumber: number, group: string) {
    if (group === 'first') {
      this.firstGroupTeachersVisible[lessonNumber] = true;
      this.setTeacherAutocompleteFirstGroup(lessonNumber);
    }
    if (group === 'second') {
      this.secondGroupTeachersVisible[lessonNumber] = true;
      this.setTeacherAutocompleteSecondGroup(lessonNumber);
    }
  }

  removeTeacher(lessonNumber: number, group: string) {
    if (group === 'first') {
      this.firstGroupTeachersVisible[lessonNumber] = false;
      this.dailySchedule.at(lessonNumber).get('firstGroupTeacher').patchValue('');
    }
    if (group === 'second') {
      this.secondGroupTeachersVisible[lessonNumber] = false;
      this.dailySchedule.at(lessonNumber).get('secondGroupTeacher').patchValue('');    
    }
  }

  setTeacherAutocompleteFirstGroup(lessonNumber: number) {
    this.filteredTeachersFirstGroup = this.dailySchedule.controls[lessonNumber].get('firstGroupTeacher').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterTeachers(value.toString(), this.teachers))
      );
  }

  setTeacherAutocompleteSecondGroup(lessonNumber: number) {
    this.filteredTeachersSecondGroup = this.dailySchedule.controls[lessonNumber].get('secondGroupTeacher').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterTeachers(value.toString(), this.teachers))
      );
  }

  private _filterTeachers(value: any, arr: any[]): string[] {
    const filterValue = value.toLowerCase();
    return arr.filter(option => option.fullName.toLowerCase().includes(filterValue));
  }

  displayTeacherFn(teacher?: any): string | undefined {
    return teacher ? teacher.fullName : undefined;
  }

  setSubjectAutocompleteFirstGroup(lessonNumber: number) {
    this.filteredSubjectsFirstGroup = this.dailySchedule.controls[lessonNumber].get('firstGroup').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterSubjects(value.toString(), this.subjects))
      );
  }

  setSubjectAutocompleteSecondGroup(lessonNumber: number) {
    this.filteredSubjectsSecondGroup = this.dailySchedule.controls[lessonNumber].get('secondGroup').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterSubjects(value.toString(), this.subjects))
      );
  }

  private _filterSubjects(value: any, arr: any[]): string[] {
    const filterValue = value.toLowerCase();
    return arr.filter(option => option.subjectName.toLowerCase().includes(filterValue));
  }

  displaySubjectFn(subject?: any): string | undefined {
    return subject ? subject.subjectName : undefined;
  }

  ngOnDestroy() {
    this.teachersSubscription.unsubscribe();
    this.subjectsSubscription.unsubscribe();
  }
}
