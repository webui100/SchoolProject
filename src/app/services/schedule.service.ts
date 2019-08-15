import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as ScheduleModels from 'src/app/models/schedule';
import { HttpClient } from '@angular/common/http';
import { Store, select } from '@ngrx/store';
import { getSchedule } from '../store/schedule/schedule.actions';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private BASE_URI = environment.APIEndpoint;

  constructor(private http: HttpClient,
    private notify: NotificationService,
    private store: Store<{ schedule }>) { }

  getSchedule(classId) {
    return this.http.get(`${this.BASE_URI}classes/${classId}/schedule`)
      .subscribe(res => this.store.dispatch(getSchedule(classId)));
  }

  postSchedule(form: any) {
    console.log(form, !!form.scheduleForWeek.monday[0].firstGroup);
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
        console.log(form.scheduleForWeek[day]);
        if (daySubjects.includes(day)) {
          for (let i = 0; i < form.scheduleForWeek[day].length; i++) {
            if (!!form.scheduleForWeek[day][i].firstGroup) {
              const tempSubjects: ScheduleModels.PostLesson = {
                lessonNumber: `${i+1}`,
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

    const scheduleObject: ScheduleModels.Schedule = {
      classId: form.class.id,
      className: form.class,
      endOfSemester: `${parseInt(form.year)}-12-31`,
      fridaySubjects: daysSubjects.fridaySubjects,
      mondaySubjects: daysSubjects.mondaySubjects,
      saturdaySubjects: daysSubjects.saturdaySubjects,
      startOfSemester: `${parseInt(form.year)}-08-28`,
      thursdaySubjects: daysSubjects.thursdaySubjects,
      tuesdaySubjects: daysSubjects.tuesdaySubjects,
      wednesdaySubjects: daysSubjects.wednesdaySubjects
    };
    console.log(scheduleObject);

    return this.http
      .post(`${this.BASE_URI}classes/${form.class.id}/schedule`, scheduleObject, {
        observe: 'response'
      })
      .subscribe(res => {
        if (res.status === 200 || res.status === 201) {
          this.notify.notifySuccess('Розклад доданий');
          // this.store.dispatch(addStudentsAction({ addedStudent: data }));
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
      const teacherId = parseInt(uniqueTeacherSubjectsArray[i].slice(uniqueTeacherSubjectsArray[i].indexOf('-') + 1));
      const subjectId = parseInt(uniqueTeacherSubjectsArray[i]);
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
}
