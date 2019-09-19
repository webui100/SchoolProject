import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Store, select } from '@ngrx/store';
import { getTeacherJournalsAction,
        getTeacherSubjectsAction,
        setCurrentJournalAction,
        setCurrentJournalToListAction } from '../store/teacher-panel/teacher-panel.action';
import * as jwt_decode from 'jwt-decode';
import { Subscription } from 'rxjs';
import { selectUploadedJournals } from '../store/teacher-panel/teacher-panel.selector';

@Injectable({
    providedIn: "root"
  })
export class TeacherPanelService{
    private BASE_URI = environment.APIEndpoint;

    private uploadedJournalsList$: any;
    private uploadedJournalsListSubscription: Subscription;

    constructor(
      private http: HttpClient,
      private store: Store<{ object }>,
      private journalStore: Store<{ teacherPanel }>
    ){
      this.uploadedJournalsList$ = this.journalStore.pipe(select(selectUploadedJournals))
     }

    getTeacherId() {
      const token = sessionStorage.getItem('token');
      return jwt_decode(token).jti;
    }
//------------------------------------------------------------
    getTeacherSubjectsService() { 
      const teacherId = this.getTeacherId();
      return this.http.get(`${this.BASE_URI}subjects/teachers/${teacherId}`)
      .subscribe(response => {
        //@ts-ignore
        this.store.dispatch(getTeacherSubjectsAction({ subjectsList: response.data }));
      });
  }
//------------------------------------------------------------  
    getTeacherJournalsService() { 
        const teacherId = this.getTeacherId();
        return this.http.get(`${this.BASE_URI}journals/teachers/${teacherId}/active`)
        .subscribe(response => {
          //@ts-ignore
          this.store.dispatch(getTeacherJournalsAction({ journalsList: response.data }));
        });
    }

  putSelectedJournalToStore(journal: any): void {
    this.store.dispatch(setCurrentJournalAction({currentJournal: journal}));

    this.uploadedJournalsListSubscription = this.uploadedJournalsList$.subscribe(res => {
      if (!res.some((item: any) => item.idSubject === journal.idSubject && item.idClass === journal.idClass)) {
        this.getCurrentJournal(journal.idClass, journal.idSubject);
        this.uploadedJournalsListSubscription.unsubscribe()
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
}
