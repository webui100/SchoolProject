import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { TeachersService } from 'src/app/services/teachers.service';
import { selectTeachers, selectTeachersList } from 'src/app/store/teachers/teachers.selector';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'webui-daily-schedule',
  templateUrl: './daily-schedule.component.html',
  styleUrls: ['./daily-schedule.component.scss']
})
export class DailyScheduleComponent implements OnInit {
  formDailySchedule: FormGroup;
  secondGroupVisible: boolean[] = [];
  firstGroupTeachersVisible: boolean[] = [];
  secondGroupTeachersVisible: boolean[] = [];
  dailySchedule;

  teacher = new FormControl(); //array
  teachers: object[] = [];
  teachersTemp$: any;
  filteredTeachers: Observable<string[]>;

  lessonsMaxPerDay = 8;

  @Input() lesson: {};
  @Input() dayOfWeek: string;
  @Input() subjects: [];

  @Output() addDailySubjects: EventEmitter<FormArray> = new EventEmitter();

  constructor(private formBuilder: FormBuilder,
              private teachersObj: TeachersService,
              private storeTeachers: Store<{ teachers }>) {
    this.teachersTemp$ = this.storeTeachers.pipe(select(selectTeachersList));

              }

  ngOnInit() {
    this.addDailySubjects.emit(this.dailySchedule);
    this.buildDailySchedul();

    this.teachersTemp$.subscribe(res => {
      if (!res) {
        this.teachersObj.getTeachers();
      }
      for (const key in res) {
        if (res.hasOwnProperty(key)) {
          const teacher = res[key];
          this.teachers.push({
                fullName: `${teacher.lastname} ${teacher.firstname} ${teacher.patronymic}`,
                id: teacher.id
              }
              );
        }
      }
    });

    for (let i = 0; i < this.lessonsMaxPerDay; i++) {
      this.secondGroupVisible.push(false);
    }
  }

  /** Method initializes the initial state of the component's template */
  buildDailySchedul() {
    this.formDailySchedule = this.formBuilder.group({
      dailySchedule: this.formBuilder.array([
        this.formBuilder.group({
          firstGroup: this.formBuilder.control(''),
          secondGroup: this.formBuilder.control(''),
          firstGroupTeacher: this.formBuilder.control(''),
          secondGroupTeacher: this.formBuilder.control('')
        })
      ])
    });
  }

  addLesson(lessonNumber) {
    this.dailySchedule = this.formDailySchedule.get('dailySchedule');
    if (lessonNumber < (this.lessonsMaxPerDay - 1) && this.dailySchedule.length === lessonNumber + 1) {
      this.dailySchedule.push(this.formBuilder.group({
        firstGroup: this.formBuilder.control(''),
        secondGroup: this.formBuilder.control(''),
        firstGroupTeacher: this.formBuilder.control(''),
        secondGroupTeacher: this.formBuilder.control('')
      }));
    }
    // console.log(this.dailySchedule.value[lessonNumber].firstGroup);
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

  removeSecondGroup(lessonNumber) { //онулювати значення "предмет" 2-ї групи
    this.secondGroupVisible[lessonNumber] = false;
  }

  addTeacherToLesson(lessonNumber, group: string) {
    if (group === 'first') {this.firstGroupTeachersVisible[lessonNumber] = true }
    if (group === 'second') {this.secondGroupTeachersVisible[lessonNumber] = true }
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

  removeTeacher(lessonNumber, group: string) { //онулювати значення "вчитель"
    if (group === 'first') {this.firstGroupTeachersVisible[lessonNumber] = false }
    if (group === 'second') {this.secondGroupTeachersVisible[lessonNumber] = false }

          // this.teachersVisible[lessonNumber] = false;
  }

  // private _filter(value: string, arr: any[]): string[] {
  //   const filterValue = value.toLowerCase();
  //   if (typeof (arr[0]) === 'number') {
  //     arr.map((item, index) => arr[index] = item.toString());
  //   }
  //   return arr.filter(option => option.toLowerCase().includes(filterValue));
  // }

}
