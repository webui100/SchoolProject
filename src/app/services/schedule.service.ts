import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as ScheduleModels from 'src/app/models/schedule';
import { HttpClient } from '@angular/common/http';
import { Store, select } from '@ngrx/store';
import { setSchedule, setClearedSchedule, setSavedSchedule } from '../store/schedule/schedule.actions';
import { NotificationService } from './notification.service';
import { FormBuilder, Validators } from '@angular/forms';
import { listValidation } from 'src/app/containers/schedule/validators.directive';
import { Subscription } from 'rxjs';
import { selectTeachers } from '../store/teachers/teachers.selector';
import { selectAllSubjects } from '../store/subjects/subjects.selector';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private BASE_URI = environment.APIEndpoint;
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  currentMonth = this.currentDate.getMonth();
  currentDayOfMonth = this.currentDate.getDate();
  academicYearsStart: number;
  firstTermMinStart: Date;

  teachersTemp$: any;
  subjectsTemp$: any;
  subjectsSubscription: Subscription;
  teachersSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private notify: NotificationService,
    private store: Store<{ schedule }>,
    private storeSubjects: Store<{ subjects }>,
    private storeTeachers: Store<{ teachers }>) {
    this.teachersTemp$ = this.storeTeachers.pipe(select(selectTeachers));
    this.subjectsTemp$ = this.storeSubjects.pipe(select(selectAllSubjects));
  }

  getSubjects() {
    const subjects = [];
    this.subjectsSubscription = this.subjectsTemp$.subscribe(res => {
      for (const key in res) {
        if (res.hasOwnProperty(key)) {
          subjects.push(res[key]);
        }
      }
    });
    return subjects
  }

  getTeachers() {
    const teachers = [];
    this.teachersSubscription = this.teachersTemp$.subscribe(res => {
      for (const key in res) {
        if (res.hasOwnProperty(key)) {
          const teacher = res[key];
          teachers.push({
            fullName: `${teacher.lastname} ${teacher.firstname} ${teacher.patronymic}`,
            id: teacher.id
          });
        }
      }
    });
    return teachers
  }

  setScheduleToStore(form: any, scheduleSaved: {}, scheduleCleared: {}) {
    form.scheduleSaved = scheduleSaved;
    form.scheduleCleared = scheduleCleared;
    this.store.dispatch(setSchedule(form))
  }

  setClearedScheduleToStore(form: any, scheduleCleared: {}) {
    form.scheduleCleared = scheduleCleared;
    this.store.dispatch(setClearedSchedule(form))
  }

  postSchedule(form: any, savedSchedule: {}) {
    form.savedSchedule = savedSchedule;
    this.store.dispatch(setSavedSchedule(form));

    const mondaySubjects = [];
    const tuesdaySubjects = [];
    const wednesdaySubjects = [];
    const thursdaySubjects = [];
    const fridaySubjects = [];
    const saturdaySubjects = [];

    const daysSubjects = {
      mondaySubjects,
      tuesdaySubjects,
      wednesdaySubjects,
      thursdaySubjects,
      fridaySubjects,
      saturdaySubjects
    };

    Object.keys(form.scheduleForWeek).forEach(day => {
      Object.keys(daysSubjects).forEach(daySubjects => {
        if (daySubjects.includes(day)) {
          for (let i = 0; i < form.scheduleForWeek[day].length; i++) {
            if (!!form.scheduleForWeek[day][i].firstGroup) {
              const tempSubjects: ScheduleModels.PostLesson = {
                lessonNumber: `${i + 1}`,
                subjectDescription: form.scheduleForWeek[day][i].firstGroup.subjectDescription,
                subjectId: form.scheduleForWeek[day][i].firstGroup.subjectId,
                subjectName: form.scheduleForWeek[day][i].firstGroup.subjectName,
              };
              daysSubjects[daySubjects].push(tempSubjects);
            }
          }
        }
      });
    });

    const termEndDate = new Date(form.termEndDate);
    const termStartDate = new Date(form.termStartDate);

    const scheduleObject: ScheduleModels.Schedule = {
      classId: form.class.id,
      className: form.class,
      endOfSemester: `${termEndDate.getFullYear()}-${("0" + (termEndDate.getMonth() + 1)).slice(-2)}-${("0" + termEndDate.getDate()).slice(-2)}`,
      fridaySubjects: daysSubjects.fridaySubjects,
      mondaySubjects: daysSubjects.mondaySubjects,
      saturdaySubjects: daysSubjects.saturdaySubjects,
      startOfSemester: `${termStartDate.getFullYear()}-${("0" + (termStartDate.getMonth() + 1)).slice(-2)}-${("0" + termStartDate.getDate()).slice(-2)}`,
      thursdaySubjects: daysSubjects.thursdaySubjects,
      tuesdaySubjects: daysSubjects.tuesdaySubjects,
      wednesdaySubjects: daysSubjects.wednesdaySubjects
    };

    return this.http
      .post(`${this.BASE_URI}classes/${form.class.id}/schedule`, scheduleObject, {
        observe: 'response'
      })
      .subscribe(res => {
        if (res.status === 200 || res.status === 201) {
          this.notify.notifySuccess('Розклад доданий');
        } else {
          this.notify.notifyFailure(`Помилка додавання розкладу. Статус: ${res.status}`);
        }
      });
  }

  postTeacherToJournal(form: any) {
    const uniqueTeacherSubjects = new Set();
    Object.keys(form.scheduleForWeek).forEach(day => {
      for (let i = 0; i < form.scheduleForWeek[day].length; i++) {
        if (!!form.scheduleForWeek[day][i].firstGroup && !!form.scheduleForWeek[day][i].firstGroupTeacher) {
          // tslint:disable-next-line: max-line-length
          const uniqueTeacherSubject = `${form.scheduleForWeek[day][i].firstGroup.subjectId}-${form.scheduleForWeek[day][i].firstGroupTeacher.id}`;
          uniqueTeacherSubjects.add(uniqueTeacherSubject);
        }
        if (!!form.scheduleForWeek[day][i].secondGroup && !!form.scheduleForWeek[day][i].secondGroupTeacher) {
          // tslint:disable-next-line: max-line-length
          const uniqueTeacherSubject = `${form.scheduleForWeek[day][i].secondGroup.subjectId}-${form.scheduleForWeek[day][i].secondGroupTeacher.id}`;
          uniqueTeacherSubjects.add(uniqueTeacherSubject);
        }
      }
    });
    const uniqueTeacherSubjectsArray = [...uniqueTeacherSubjects];
    const classId = form.class.id;
    for (let i = 0; i < uniqueTeacherSubjectsArray.length; i++) {
      const teacherId = parseInt((uniqueTeacherSubjectsArray[i]as string).slice((uniqueTeacherSubjectsArray[i] as string).indexOf('-') + 1));
      const subjectId = parseInt(uniqueTeacherSubjectsArray[i]as string);

      this.postRequestTeacherToJournal(teacherId, classId, subjectId);
    }
  }

  postRequestTeacherToJournal(teacherId: number, classId: number, subjectId: number) {
    return this.http
      .post(`${this.BASE_URI}teachers/${teacherId}/classes/${classId}/subjects/${subjectId}/journal`,
        null,
        {
          observe: 'response'
        })
      .subscribe(res => {
        if (res.status === 200 || res.status === 201) {
          this.notify.notifySuccess('Вчитель доданий до журналу');
        } else {
          this.notify.notifyFailure(`Помилка додавання вчителя до журналу. Статус: ${res.status}`);
        }
      });
  }

  createYear() {
    this.academicYearsStart = this.currentMonth < 7 ? this.currentYear - 1 : this.currentYear;
    return this.academicYearsStart;
  }

  getDafaultDates(term: string): ScheduleModels.DafaultTermDates {
    let startYear: number,
      startMonth: number,
      startDate: number,
      endYear: number,
      endMonth: number,
      endDate: number;

    switch (term) {
      case '1':
        startYear = this.academicYearsStart;
        startMonth = 8;
        startDate = 1;
        endYear = this.academicYearsStart;
        endMonth = 11;
        endDate = 31;
        break;
      case '2':
        startYear = this.academicYearsStart + 1;
        startMonth = 0;
        startDate = 15;
        endYear = this.academicYearsStart + 1;
        endMonth = 4;
        endDate = 30;
        break;
      case '1 - 2':
        startYear = this.academicYearsStart;
        startMonth = 8;
        startDate = 1;
        endYear = this.academicYearsStart + 1;
        endMonth = 4;
        endDate = 30;
        break;
    };
    
    this.firstTermMinStart = new Date(this.academicYearsStart, 7, 1);

    if ((new Date()) > this.firstTermMinStart) {
      this.firstTermMinStart = new Date((new Date()).getTime() + 24 * 3600 * 1000);
    }

    const defaultDates: ScheduleModels.DafaultTermDates = {
      start: new Date(startYear, startMonth, startDate),
      end: new Date(endYear, endMonth, endDate),
      minStart: this.firstTermMinStart,
      maxEnd: new Date(this.academicYearsStart + 1, 6, 31)
    };
    if (defaultDates.minStart > defaultDates.start) {
      defaultDates.start = defaultDates.minStart
    }
    return defaultDates;
  }

  buildScheduleForm(terms, classes) {
    return this.formBuilder.group({
      term: this.formBuilder.control('', [Validators.required, listValidation(terms)]),
      class: this.formBuilder.control('', [Validators.required, listValidation(classes)]),
      year: this.formBuilder.control(''),
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
}
