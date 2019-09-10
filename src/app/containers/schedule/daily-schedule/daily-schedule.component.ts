import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { listValidation } from 'src/app/containers/schedule/validators.directive';
import { ScheduleService } from 'src/app/services/schedule.service';

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
  filteredTeachersFirstGroup: Observable<string[]>;
  filteredTeachersSecondGroup: Observable<string[]>;
  filteredSubjectsFirstGroup: Observable<string[]>;
  filteredSubjectsSecondGroup: Observable<string[]>;

  lessonsMaxPerDay = 8;
  saturdayFirstLesson = false;

  @Input() public dailySchedule: FormArray;
  @Input() public dayName: string;

  constructor(
    private formBuilder: FormBuilder,
    private schedule: ScheduleService) {}

  ngOnInit() {
    this.subjects = this.schedule.getSubjects();
    this.teachers = this.schedule.getTeachers();

    this.buildDailySchedule();

    for (let i = 0; i < this.lessonsMaxPerDay; i++) {
      this.secondGroupVisible.push(false);
    }
  }

  buildDailySchedule() {
    if (this.dayName !== 'saturday' && !this.dailySchedule.length) {
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
        this.dailySchedule.length === this.lessonsMaxPerDay - 1 &&
        this.dailySchedule.at(this.lessonsMaxPerDay - 2).get('firstGroup').value )) {
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
    if (this.dailySchedule.at(lessonNumber)) this.dailySchedule.at(lessonNumber).get('secondGroup').patchValue('');
    if (this.dailySchedule.at(lessonNumber)) this.dailySchedule.at(lessonNumber).get('secondGroupTeacher').patchValue('');
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
      if (this.dailySchedule.at(lessonNumber)) this.dailySchedule.at(lessonNumber).get('firstGroupTeacher').patchValue('');
    }
    if (group === 'second') {
      this.secondGroupTeachersVisible[lessonNumber] = false;
      if (this.dailySchedule.at(lessonNumber)) this.dailySchedule.at(lessonNumber).get('secondGroupTeacher').patchValue('');    
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
  }
}
