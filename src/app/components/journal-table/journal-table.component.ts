import { Component, OnInit, OnDestroy } from '@angular/core';
// import { TeacherPanelService } from 'src/app/services/teacher-panel.service';
import { Store, select } from '@ngrx/store';
import { Subscription, Observable, Subject } from 'rxjs';
import { selectCurrentJournal, selectCurrentJournalData } from 'src/app/store/teacher-panel/teacher-panel.selector';
import { MatTableDataSource } from '@angular/material';
import { setCurrentLessonIdToStoreAction } from 'src/app/store/teacher-panel/teacher-panel.action';
import { MarkControllerService } from 'src/app/services/mark-controller.service';
import { activeMark } from 'src/app/store/marks/marks.selector';
import { StudentDiaryService } from '../../services/student-diary.service';
import { take, takeUntil } from 'rxjs/operators';
import { HomeworkDialogComponent } from 'src/app/components/homework-dialog/homework-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'webui-journal-table',
  templateUrl: './journal-table.component.html',
  styleUrls: ['./journal-table.component.scss']
})
export class JournalTableComponent implements OnInit, OnDestroy {

  journal: any;
  journalArray: any[];
  journalData: any;
  chosenJournal$: any;
  chosenJournalData$: any;
  chosenJournalSubscription: Subscription;
  chosenJournalDataSubscription: Subscription;
  chosenMarkField: HTMLElement;
  chosenLesson: any;

  tableDates: string[];
  tableHeaders: string[];
  tableMarkTypes: string[];
  tableMarkTypesHeaders: string[];
  journalDataTable: any;

  markFieldVisible = false;
  markFieldTop: number;
  markFieldLeft: number;
  getMarksList$: Observable<any>;
  getMarksListSubscription: Subscription;

  private hoveredLesson = null;

  private destroyStream$ = new Subject<void>();
  public subject = new Subject<string | ArrayBuffer>();
  name: any;

  constructor(
    // private teacherPanelService: TeacherPanelService,
    private markServ: MarkControllerService,
    private store: Store<object>,
    private teacherPanelStore: Store<{ teacherPanel }>,
    private studentDiary: StudentDiaryService,
    public dialog: MatDialog
  ) {
    this.getMarksList$ = this.store.pipe(select(activeMark(true)));
    this.chosenJournal$ = this.teacherPanelStore.pipe(select(selectCurrentJournal));
    this.chosenJournalData$ = this.teacherPanelStore.pipe(select(selectCurrentJournalData));
  }

  ngOnInit() {
    this.getChosenJournal();
    this.getChosenJournalData();
    this.getMarksTypes();
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
    console.log(this.journalArray)
    this.journalDataTable = new MatTableDataSource<any>(this.journalArray);

    this.tableDates = this.journalData.journal[0].marks.reduce((accArr: [], day: any) => [...accArr, day.dateMark], []);
    this.tableMarkTypes = this.journalData.journal[0].marks.reduce((accArr: [], day: any) => [...accArr, day.typeMark], []);
    this.tableHeaders = ['fullName', ...this.tableDates];
  }

  setLessonIdToStore(lesson: any): void {
    this.teacherPanelStore.dispatch(setCurrentLessonIdToStoreAction({ currentLessonId: lesson.idLesson }))
  }

  getMarksTypes() {
    this.getMarksListSubscription = this.getMarksList$.subscribe(val => {
      if (!val.length) {
        this.markServ.getMarks();
      };
      this.getMarksListSubscription.unsubscribe()
    })

  }

  getPosition(event): void {
    this.markFieldLeft = event.srcElement.getBoundingClientRect().left;
    this.markFieldTop = event.srcElement.getBoundingClientRect().top + event.srcElement.getBoundingClientRect().height;
  }

  expandedFn(val) {
  }

  ngOnDestroy() {
    this.chosenJournalDataSubscription.unsubscribe()
  }

  downloadFile(lessonId: number): void {
    this.studentDiary.downloadHomeworkFile(lessonId);
  }

  openFile(lessonId: number): void {
    this.studentDiary.openHomeworkFile(lessonId)
      .pipe(takeUntil(this.destroyStream$))
      .subscribe(data => {
        this.dialog.open(HomeworkDialogComponent, {
          panelClass: 'custom-dialog-container',
          width: '90vw',
          height: '80vh',
          data
        });
      });
  }

  readFile(inputValue: HTMLInputElement): void {
    const file: File = inputValue.files[0];
    const type = file.type;
    const name = file.name;
    this.name = name;
    const reader: FileReader = new FileReader();
    reader.onloadend = () => {
      const data = `${reader.result}`.split(',')[1];
      const fileData = {
        type: type,
        name: name,
        data: data
      };
      this.subject.next(fileData);
    };
    reader.readAsDataURL(file);
  }

  selectFile(event): void {
    this.readFile(event.target);
    this.subject
      .pipe(take(1))
      .subscribe(data => {
        console.log(data);
        // send put method (http://35.228.14.201:8080/swagger-ui.html#!/homework-controller/postHomeworkUsingPUT)
      });
  }
}
