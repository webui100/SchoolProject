import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Store, select } from '@ngrx/store';
import { getTeacherJournalsAction,
        getTeacherSubjectsAction,
        setCurrentJournalAction,
        setCurrentJournalToListAction,
        setHomeworkListAction,
        putHomeworkAction,
        saveMarkAction,
        changeMarkTypeAction } from '../store/teacher-panel/teacher-panel.action';
import { Subscription } from 'rxjs';
import { selectUploadedJournals } from '../store/teacher-panel/teacher-panel.selector';
import { NotificationService } from './notification.service';
import { selectId } from '../store/login/login.selectors';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';



@Injectable({
    providedIn: "root"
  })
export class TeacherPanelService implements OnDestroy{
    private BASE_URI = environment.APIEndpoint;
    private uploadedJournalsList$: any;
    private uploadedJournalsListSubscription: Subscription;
    public subject = new Subject<string | ArrayBuffer>();
    private destroyStream$ = new Subject<void>();
    private id: number;

    constructor(
      private http: HttpClient,
      private store: Store<{ object }>,
      private journalStore: Store<{ teacherPanel }>,
      private userStore: Store<{ currentUser }>,

      private notify: NotificationService,
    ){
      this.uploadedJournalsList$ = this.journalStore.pipe(select(selectUploadedJournals));
     
      this.userStore.pipe(
        select(selectId),
        takeUntil(this.destroyStream$)
      )
      .subscribe(id => this.id = id);
     }
    // getTeacherId() {
    //   const token = sessionStorage.getItem('token');
    //   return jwt_decode(token).jti;
    // }
    getTeacherSubjectsService() { 
      // const teacherId = this.getTeacherId();
      if (this.id){
          return this.http.get(`${this.BASE_URI}subjects/teachers/${this.id}`)
        .subscribe(response => {
          //@ts-ignore
          this.store.dispatch(getTeacherSubjectsAction({ subjectsList: response.data }));
        });
      }
  }
    getTeacherJournalsService() { 
        // const teacherId = this.getTeacherId();
        if (this.id){
        return this.http.get(`${this.BASE_URI}journals/teachers/${this.id}/active`)
        .subscribe(response => {
          //@ts-ignore
          this.store.dispatch(getTeacherJournalsAction({ journalsList: response.data }));
        });
      }
    }

  putSelectedJournalToStore(journal: any): void {
    this.store.dispatch(setCurrentJournalAction({currentJournal: journal}));

    this.uploadedJournalsListSubscription = this.uploadedJournalsList$.subscribe(res => {
      if (!res.some((item: any) => item.idSubject === journal.idSubject && item.idClass === journal.idClass)) {
        this.getCurrentJournal(journal.idClass, journal.idSubject);
        if (this.uploadedJournalsListSubscription) {
          this.uploadedJournalsListSubscription.unsubscribe()
        }
      }
    })
  }

  getCurrentJournal(idClass: number, idSubject: number) {
    return this.http.get(`${this.BASE_URI}journals/subjects/${idSubject}/classes/${idClass}`)
      .subscribe(response => {
        //@ts-ignore
        this.store.dispatch(setCurrentJournalToListAction({ currentJournal: response.data, idClass, idSubject }));
      });
  }

  getHomeworkList(idSubject: number, idClass: number) {
    return this.http.get(`${this.BASE_URI}homeworks/subjects/${idSubject}/classes/${idClass}`)
      .subscribe(response => {
        //@ts-ignore
        this.store.dispatch(setHomeworkListAction({ homeworkList: response.data }));
      });
  }

  postHomework(homework: any) {
    return this.http.put(`${this.BASE_URI}homeworks/files`, homework, {observe: 'response'})
    .subscribe(res => {
      if (res.status === 200 || res.status === 201) {
        this.notify.notifySuccess('Домашнє завдання збережене');
      } else {
        this.notify.notifyFailure(`Помилка збереження домашнього завдання. Статус: ${res.status}`);
      }
      this.store.dispatch(putHomeworkAction({ homework: homework }));
    });
  }

  postSaveMark(body: any) {
    return this.http.post(`${this.BASE_URI}marks`, body, {observe: 'response'})
    .subscribe(res => {
      if (res.status === 200 || res.status === 201) {
        this.notify.notifySuccess('Оцінка збережена');
      } else {
        this.notify.notifyFailure(`Помилка збереження оцінки. Статус: ${res.status}`);
      }

      this.store.dispatch(saveMarkAction({ markData: body }));
    });
  }
  
  putChangeMarkType(newMarkType: any, idLesson: number) {
    return this.http.put(`${this.BASE_URI}marks/lessons/${idLesson}/marktype`,
      newMarkType,
      {observe: 'response'})
    .subscribe(res => {
      if (res.status === 200 || res.status === 201) {
        this.notify.notifySuccess('Тип оцінки змінено');
      } else {
        this.notify.notifyFailure(`Помилка зміни типу оцінки. Статус: ${res.status}`);
      }

      this.store.dispatch(changeMarkTypeAction({ newMarkType: newMarkType, idLesson: idLesson }));
    });
  }
  ngOnDestroy(): void {
    this.destroyStream$.next();
  }
}
