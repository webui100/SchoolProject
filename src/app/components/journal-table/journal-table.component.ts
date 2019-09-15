import { Component, OnInit, OnDestroy } from '@angular/core';
// import { TeacherPanelService } from 'src/app/services/teacher-panel.service';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { selectCurrentJournal, selectCurrentJournalData } from 'src/app/store/teacher-panel/teacher-panel.selector';
import { MatTableDataSource } from '@angular/material';
import { setCurrentLessonIdToStoreAction } from 'src/app/store/teacher-panel/teacher-panel.action';

@Component({
  selector: 'webui-journal-table',
  templateUrl: './journal-table.component.html',
  styleUrls: ['./journal-table.component.scss']
})
export class JournalTableComponent implements OnInit, OnDestroy {

  journal: any;
  journalData: any;
  chosenJournal$: any;
  chosenJournalData$: any;
  chosenJournalSubscription: Subscription;
  chosenJournalDataSubscription: Subscription;

  tableDates: string[];
  tableHeaders: string[];
  journalDataTable: any;

  constructor(
    // private teacherPanelService: TeacherPanelService,
    private store: Store<{ teacherPanel }>
  ) {
    this.chosenJournal$ = this.store.pipe(select(selectCurrentJournal));
    this.chosenJournalData$ = this.store.pipe(select(selectCurrentJournalData));
  }

  ngOnInit() {
    this.getChosenJournal();
    this.getChosenJournalData();
  }

  getChosenJournal(): void {
    this.chosenJournalSubscription = this.chosenJournal$.subscribe(res => {
      this.journal = res
    });
  }

  getChosenJournalData() {
    this.chosenJournalDataSubscription = this.chosenJournalData$.subscribe(res => {
      if (res && res.journal[0]) {
        this.journalData = res;
        this.buildTable();
      }
    });
  }

  buildTable(): void {
    const journalArray = Object.values(this.journalData.journal);
    console.log(journalArray)
    this.journalDataTable = new MatTableDataSource<any>(journalArray);

    this.tableDates = this.journalData.journal[0].marks.reduce((accArr: [], day: any) => [...accArr, day.dateMark.slice(5)], []);
    this.tableHeaders = ['fullName', ...this.tableDates];
  }

  setLessonIdToStore(lessonId: number): void {
    console.log(lessonId);
    this.store.dispatch(setCurrentLessonIdToStoreAction({ currentLessonId: lessonId }))
  }

  ngOnDestroy() {
    this.chosenJournalDataSubscription.unsubscribe()
  }
}
