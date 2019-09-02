import { Component, OnInit } from '@angular/core';
import { TeacherJournal } from '../../models/teacher-journals';
import { TeacherJournalsService } from '../../services/teacher-journals.service';
import { selectAll } from "../../store/teacher-journals/teacher-journals.selector";
import { Store, select } from "@ngrx/store";
import { MatTableDataSource } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'webui-teacher-journals',
  templateUrl: './teacher-journals.component.html',
  styleUrls: ['./teacher-journals.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('200ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TeacherJournalsComponent implements OnInit { 
  private data$: any;
  data: TeacherJournal[];

  constructor(
    private teacherJournals: TeacherJournalsService,
    private store: Store<{ teacherJournals }>) {
      this.data$ = this.store.pipe(select(selectAll));
    };
    private columnsToDisplay: string[] = ['subjectName', 'className', 'academicYear'];
    private expandedElement: TeacherJournal | null;
    private teacherJournalsList: any;


  // Get journals
  getJournals(): void {
    this.data$.subscribe(response => {
    this.data = response;
    this.teacherJournalsList = new MatTableDataSource<TeacherJournal>(this.data);
    });
    if (!this.data) {
      this.teacherJournals.getTeacherJournalsService();
    }
  }

  ngOnInit(){
    this.getJournals();
  }

}
