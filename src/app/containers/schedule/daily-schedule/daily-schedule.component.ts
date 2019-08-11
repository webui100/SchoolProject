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
  teachersTemp$: any;
  subjectsTemp$: any;
  filteredTeachers: Observable<string[]>;

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

    // this.subjectsTemp$.subscribe();

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
  }

  addLesson(lessonNumber) {
    if (lessonNumber < (this.lessonsMaxPerDay - 1) && this.dailySchedule.length === lessonNumber + 1) {
      this.dailySchedule.push(this.formBuilder.group({
        firstGroup: this.formBuilder.control(''),
        secondGroup: this.formBuilder.control(''),
        firstGroupTeacher: this.formBuilder.control(''),
        secondGroupTeacher: this.formBuilder.control('')
      }));
    }
  }

  removeLesson(lessonNumber) {
    this.dailySchedule.removeAt(lessonNumber);
    this.removeSecondGroup(lessonNumber);
    this.removeTeacher(lessonNumber, 'first');
    this.removeTeacher(lessonNumber, 'second');
    if (lessonNumber === (this.lessonsMaxPerDay - 1)) {
      this.addLesson(lessonNumber - 1);
    }
  }

  addSecondGroup(lessonNumber: number): void {
    this.secondGroupVisible[lessonNumber] = true;
  }

  removeSecondGroup(lessonNumber) { // онулювати значення "предмет" 2-ї групи
    this.secondGroupVisible[lessonNumber] = false;
  }

  addTeacherToLesson(lessonNumber, group: string) {
    if (group === 'first') {this.firstGroupTeachersVisible[lessonNumber] = true; }
    if (group === 'second') {this.secondGroupTeachersVisible[lessonNumber] = true; }
    // this.dailySchedule.value[lessonNumber].firstGroupTeacher.valueChanges;

    // this.filteredTeachers = this.dailySchedule.value[lessonNumber].get('firstGroupTeacher').valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => {
    //       console.log(value);
    //       this._filter(value, this.teachers);
    //     })
    //   ).subscribe();
  }

  removeTeacher(lessonNumber, group: string) { // онулювати значення "вчитель"
    if (group === 'first') {this.firstGroupTeachersVisible[lessonNumber] = false; }
    if (group === 'second') {this.secondGroupTeachersVisible[lessonNumber] = false; }
  }

  // private _filter(value: string, arr: any[]): string[] {
  //   const filterValue = value.toLowerCase();
  //   if (typeof (arr[0]) === 'number') {
  //     arr.map((item, index) => arr[index] = item.toString());
  //   }
  //   return arr.filter(option => option.toLowerCase().includes(filterValue));
  // }

}
