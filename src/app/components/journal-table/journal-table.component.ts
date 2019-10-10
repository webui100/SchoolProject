import { Component, OnInit, OnDestroy, Input, HostListener } from '@angular/core';
import { TeacherPanelService } from 'src/app/services/teacher-panel.service';
import { Store, select } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';
import { selectCurrentJournalData, selectHomeworkList } from 'src/app/store/teacher-panel/teacher-panel.selector';
import { MatTableDataSource } from '@angular/material';
import { setCurrentLessonIdToStoreAction } from 'src/app/store/teacher-panel/teacher-panel.action';
import { MarkControllerService } from 'src/app/services/mark-controller.service';
import { activeMark } from 'src/app/store/marks/marks.selector';

@Component({
  selector: 'webui-journal-table',
  templateUrl: './journal-table.component.html',
  styleUrls: ['./journal-table.component.scss']
})
export class JournalTableComponent implements OnInit, OnDestroy {

  @Input() journal: any;

  markFieldVisible = false;
  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    if (this.markFieldVisible) {
      this.markFieldVisible = false
    }
  }

  journalArray: any[];
  journalData: any;
  chosenJournalData$: any;
  chosenJournalDataSubscription: Subscription;
  chosenMarkField: HTMLElement;
  chosenLesson: any;

  tableDates: string[];
  tableHeaders: string[];
  tableMarkTypes: string[];
  tableMarkTypesHeaders: string[];
  journalDataTable: any;

  markFieldTop: number;
  markFieldLeft: number;
  marksList$: Observable<any>;
  marksList: any[];
  marksListSubscription: Subscription;

  homeWorkList$: Observable<any>;
  homeWorkListSubscription: Subscription;
  homeworkListArray: object[];

  constructor(
    private teacherPanelService: TeacherPanelService,
    private markServ: MarkControllerService,
    private store: Store<object>,
    private teacherPanelStore: Store<{ teacherPanel }>
  ) {
    this.marksList$ = this.store.pipe(select(activeMark(true)));
    this.chosenJournalData$ = this.teacherPanelStore.pipe(select(selectCurrentJournalData));
    this.homeWorkList$ = this.teacherPanelStore.pipe(select(selectHomeworkList));
  }

  ngOnInit() {
    this.getHomeworkList();
    this.getChosenJournalData();
    this.getMarksTypes();
  }

  getChosenJournalData() {
    this.chosenJournalDataSubscription = this.chosenJournalData$.subscribe(res => {
      if (res && res.journal[0]) {
        this.journalData = res;
      }
      if (this.journalData && this.homeworkListArray.length) {
        this.buildTable();
      }
    });
  }

  buildTable(): void {
    this.journalArray = Object.values(this.journalData.journal);
    this.journalArray.forEach((item: any) => {
      item.marks.sort((a, b) => {
        if (new Date(a.dateMark) > new Date(b.dateMark))
          return 1;
        if (new Date(a.dateMark) < new Date(b.dateMark))
          return -1;
        if (new Date(a.dateMark) === new Date(b.dateMark))
          return 0;

      });
    });

    this.journalDataTable = new MatTableDataSource<any>(this.journalArray);

    this.tableDates = this.journalData.journal[0].marks
      .reduce((accArr: [], day: any) => [...accArr, day.dateMark], []);
    this.tableMarkTypes = this.journalData.journal[0].marks
      .reduce((accArr: [], day: any) => [...accArr, day.typeMark], []);
    this.tableHeaders = ['fullName', ...this.tableDates];
  }

  setLessonIdToStore(lesson: any): void {
    this.teacherPanelStore
      .dispatch(setCurrentLessonIdToStoreAction({ currentLessonId: lesson.idLesson }))
  }

  getMarksTypes() {
    this.marksListSubscription = this.marksList$.subscribe(val => {
      if (!val.length) {
        this.markServ.getMarks();
      };
      this.marksList = val;
      if (val && this.marksListSubscription) {
        this.marksListSubscription.unsubscribe()
      }
    })
  }

  getHomeworkList() {
    this.homeWorkListSubscription = this.homeWorkList$.subscribe(val => {
      if (!val.length) {
        this.teacherPanelService
          .getHomeworkList(this.journal.idSubject, this.journal.idClass);
      };
      this.homeworkListArray = Object.values(val);
      if (val && this.homeWorkListSubscription) {
        this.homeWorkListSubscription.unsubscribe();
      }
    })
  }

  getPosition(event): void {
    this.markFieldLeft = event.srcElement.getBoundingClientRect().left;
    const maxLeft = window.innerWidth - 250;
    if (this.markFieldLeft > maxLeft) {
      this.markFieldLeft = maxLeft
    }
    this.markFieldTop = event.srcElement.getBoundingClientRect().top
      + event.srcElement.getBoundingClientRect().height;
    const maxTop = window.innerHeight - 320;
    if (this.markFieldTop > maxTop) {
      this.markFieldTop = maxTop
    }
  }

  saveMark(
    mark: number,
    markType: any,
    markNote: string,
    idStudent: number,
    idLesson: number
  ): void {
    if (markType !== this.chosenLesson.typeMark) {
      const newMarkType = this.marksList.filter(item => item.markType === markType)[0];
      this.teacherPanelService.putChangeMarkType(newMarkType, idLesson);

    }

    this.teacherPanelService.postSaveMark({
      idLesson: idLesson,
      idStudent: idStudent,
      mark: mark.toString(),
      note: markNote
    });
  }

  ngOnDestroy() {
    this.chosenJournalDataSubscription.unsubscribe();
    // this.homeWorkListSubscription.unsubscribe();
    // this.marksListSubscription.unsubscribe()    
  }
}
