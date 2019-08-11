import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { selectTeachers } from 'src/app/store/teachers/teachers.selector';
import { selectAll as selectAllSubjects } from 'src/app/store/subjects/subjects.selector';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'webui-daily-schedule',
  templateUrl: './daily-schedule.component.html',
  styleUrls: ['./daily-schedule.component.scss']
})
export class DailyScheduleComponent implements OnInit {
  secondGroupVisible: boolean[] = [];
  firstGroupTeachersVisible: boolean[] = [];
  secondGroupTeachersVisible: boolean[] = [];

  teachers: object[] = [];
  subjects: object[] = [];
  teachersTemp$: any;
  subjectsTemp$: any;
  filteredTeachersFirstGroup: Observable<string[]>;
  filteredTeachersSecondGroup: Observable<string[]>;
  filteredSubjectsFirstGroup: Observable<string[]>;
  filteredSubjectsSecondGroup: Observable<string[]>;

  lessonsMaxPerDay = 8;

  @Input() public dailySchedule: FormArray;

  constructor(private formBuilder: FormBuilder,
              private storeSubjects: Store<{ subjects }>,
              private storeTeachers: Store<{ teachers }>) {
    this.teachersTemp$ = this.storeTeachers.pipe(select(selectTeachers));
    this.subjectsTemp$ = this.storeSubjects.pipe(select(selectAllSubjects));
              }

  ngOnInit() {
    this.buildDailySchedule();

    this.teachersTemp$.subscribe(response => {
      const res = response.teachersList;
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

    this.subjectsTemp$.subscribe(res => {
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

  /** Method initializes the initial state of the component's template */
  buildDailySchedule() {
    this.dailySchedule.push(this.formBuilder.group({
      firstGroup: this.formBuilder.control(''),
      secondGroup: this.formBuilder.control(''),
      firstGroupTeacher: this.formBuilder.control(''),
      secondGroupTeacher: this.formBuilder.control('')
    }));

    this.setSubjectAutocompleteFirstGroup(0);
  }

  addLesson(lessonNumber) {
    if (lessonNumber < (this.lessonsMaxPerDay - 1) &&
        this.dailySchedule.length === lessonNumber + 1) {
      this.dailySchedule.push(this.formBuilder.group({
        firstGroup: this.formBuilder.control(''),
        secondGroup: this.formBuilder.control(''),
        firstGroupTeacher: this.formBuilder.control(''),
        secondGroupTeacher: this.formBuilder.control('')
      }));

      this.setSubjectAutocompleteFirstGroup(lessonNumber + 1);
    }
  }

  removeLesson(lessonNumber) {
    this.dailySchedule.removeAt(lessonNumber);
    this.removeSecondGroup(lessonNumber);
    this.removeTeacher(lessonNumber, 'first');
    this.removeTeacher(lessonNumber, 'second');
    if (lessonNumber === (this.lessonsMaxPerDay - 1) ||
        (lessonNumber < (this.lessonsMaxPerDay - 1) &&
        this.dailySchedule.length === this.lessonsMaxPerDay - 1)) {
      this.addLesson(this.lessonsMaxPerDay - 2);
    }
  }

  addSecondGroup(lessonNumber: number): void {
    this.secondGroupVisible[lessonNumber] = true;

    this.setSubjectAutocompleteSecondGroup(lessonNumber);
  }

  removeSecondGroup(lessonNumber) { // онулювати значення "предмет" 2-ї групи
    this.secondGroupVisible[lessonNumber] = false;
  }

  addTeacherToLesson(lessonNumber, group: string) {
    if (group === 'first') {
      this.firstGroupTeachersVisible[lessonNumber] = true;
      this.setTeacherAutocompleteFirstGroup(lessonNumber);
    }
    if (group === 'second') {
      this.secondGroupTeachersVisible[lessonNumber] = true;
      this.setTeacherAutocompleteSecondGroup(lessonNumber);
    }
  }

  removeTeacher(lessonNumber, group: string) { // онулювати значення "вчитель"
    if (group === 'first') {this.firstGroupTeachersVisible[lessonNumber] = false; }
    if (group === 'second') {this.secondGroupTeachersVisible[lessonNumber] = false; }
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
}
