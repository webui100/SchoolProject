import { Component, OnInit, OnDestroy, LOCALE_ID } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DateAdapter } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { registerLocaleData } from '@angular/common';
import localeUk from '@angular/common/locales/uk';
import { addDays, subDays, getDate, getDay, setDate } from 'date-fns';

import { HomeworkDialogComponent } from '../../components/homework-dialog/homework-dialog.component';
import { StudentDiaryService } from '../../services/student-diary.service';
import { StudentProfileService } from '../../services/student-profile.service';
import { selectLessons } from '../../store/diary/diary.selectors';
import { Lesson } from '../../models/diary.model';


@Component({
  selector: 'webui-student-diary',
  templateUrl: './student-diary.component.html',
  styleUrls: ['./student-diary.component.scss'],
  providers: [{provide: LOCALE_ID, useValue: 'uk'}]
})
export class StudentDiaryComponent implements OnInit, OnDestroy {
  diary$: Observable<Lesson[]>;
  destroyStream$ = new Subject<void>();
  dateValue = this.getStartOfWeek();
  weekDays: Date[];
  dayNumbers: number[];
  showDiary?: boolean;
  availableDays?: number[];

  constructor(
    private studentDiary: StudentDiaryService,
    private studentProfile: StudentProfileService,
    private store: Store<{ diary }>,
    private dateAdapter: DateAdapter<Date>,
    public dialog: MatDialog
  ) {
    this.diary$ = this.store.pipe(select(selectLessons));
    this.store.pipe(select(selectLessons))
      .pipe(takeUntil(this.destroyStream$))
      .subscribe(lessons => {
        this.showDiary = !!(lessons && lessons.length);
        if (lessons) {
          this.availableDays = [];
          lessons.map(lesson => {
            if (!this.availableDays.includes(lesson.date[2])) {
              this.availableDays.push(lesson.date[2]);
            }
          });
        }
      });
    this.studentProfile.fetchProfile();
  }

  getStartOfWeek() {
    const today = new Date();
    const weekDaysPassed = getDay(today) - 1;
    return setDate(today, getDate(today) - weekDaysPassed);
  }

  ngOnInit(): void {
    registerLocaleData(localeUk);
    this.dateAdapter.setLocale('uk');
    this.dateAdapter.getFirstDayOfWeek = () => 1;
    this.fetchDiary();
    this.setWeekDays();
  }

  ngOnDestroy(): void {
    this.destroyStream$.next();
  }

  fetchDiary(): void {
    this.studentDiary.fetchStudentDiary(this.dateValue);
    this.setWeekDays();
  }

  setWeekDays(): void {
    this.weekDays = new Array(6).fill('');
    this.weekDays.map((item, i, arr) => arr[i] = addDays(new Date(this.dateValue), i));
    this.dayNumbers = new Array(6).fill('');
    this.dayNumbers.map((item, i, arr) => arr[i] = getDate(new Date(this.weekDays[i])));
  }

  selectPreviousWeek(): void {
    this.dateValue = subDays(new Date(this.dateValue), 7);
    this.fetchDiary();
  }

  selectNextWeek(): void {
    this.dateValue = addDays(new Date(this.dateValue), 7);
    this.fetchDiary();
  }

  selectCurrentWeek(): void {
    this.dateValue = this.getStartOfWeek();
    this.fetchDiary();
  }

  selectDay(): void {
    this.fetchDiary();
  }

  dateFilter(date) {
    const day = date.getDay();
    return day === 1;
  }

  downloadFile(lessonId): void {
    this.studentDiary.downloadHomeworkFile(lessonId);
  }

  openFile(lessonId): void {
    this.studentDiary.openHomeworkFile(lessonId)
      .subscribe(data => {
        this.dialog.open(HomeworkDialogComponent, {
          panelClass: 'custom-dialog-container',
          width: '90vw',
          height: '80vh',
          data
        });
      });
  }
}
