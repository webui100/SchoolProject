import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { DateAdapter } from '@angular/material';
import { registerLocaleData } from '@angular/common';
import localeUk from '@angular/common/locales/uk';
import { format, addDays, subDays, getDate, getDay, setDate } from 'date-fns';

import { StudentDiaryService } from '../../services/student-diary.service';
import { selectDiary } from '../../store/diary/diary.selectors';
import { Diary } from '../../store/diary/diary.reducer';

@Component({
  selector: 'webui-student-diary',
  templateUrl: './student-diary.component.html',
  styleUrls: ['./student-diary.component.scss'],
  providers: [{provide: LOCALE_ID, useValue: 'uk'}]
})
export class StudentDiaryComponent implements OnInit {
  diary?: Diary;
  dateValue = StudentDiaryComponent.getStartOfWeek();
  weekDays: Date[];
  dayNumbers: number[];
  showDiary: boolean;

  constructor(
    private studentDiary: StudentDiaryService,
    private store: Store<{ diary }>,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.store.pipe(select(selectDiary)).subscribe(data => {
      this.diary = data.diary;
      this.showDiary = data.diary && !!this.diary.data.length;
    });
  }

  static getStartOfWeek() {
    const today = new Date();
    const weekDaysPassed = getDay(today) - 1;
    return setDate(today, getDate(today) - weekDaysPassed);
  }

  ngOnInit() {
    registerLocaleData(localeUk);
    this.dateAdapter.setLocale('uk');
    this.dateAdapter.getFirstDayOfWeek = () => 1;
    this.fetchDiary();
    this.setWeekDays();
  }

  fetchDiary() {
    const date = this.dateValue;
    const formattedDate = format(
      new Date(date),
      'YYYY-MM-DD'
    );
    this.studentDiary.fetchStudentDiary(formattedDate);
    this.setWeekDays();
  }

  setWeekDays() {
    this.weekDays = new Array(5).fill('');
    this.weekDays.map((item, i, arr) => arr[i] = addDays(new Date(this.dateValue), i));
    this.dayNumbers = new Array(5).fill('');
    this.dayNumbers.map((item, i, arr) => arr[i] = getDate(new Date(this.weekDays[i])));
  }

  selectPreviousWeek() {
    this.dateValue = subDays(new Date(this.dateValue), 7);
    this.fetchDiary();
  }

  selectNextWeek() {
    this.dateValue = addDays(new Date(this.dateValue), 7);
    this.fetchDiary();
  }

  selectCurrentWeek() {
    this.dateValue = StudentDiaryComponent.getStartOfWeek();
    this.fetchDiary();
  }

  selectDay() {
    this.fetchDiary();
  }

  dateFilter(date) {
    const day = date.getDay();
    return day === 1;
  }
}
