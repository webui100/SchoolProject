import { Component, OnInit } from '@angular/core';
import { TeacherJournals } from '../../models/teacher-panel.model';
import { TeacherPanelService } from '../../services/teacher-panel.service';
import { selectAllJournals } from "../../store/teacher-panel/teacher-panel.selector";
import { Store, select } from "@ngrx/store";
import { MatTableDataSource } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'webui-teacher-panel-journals',
  templateUrl: './teacher-panel-journals.component.html',
  styleUrls: ['./teacher-panel-journals.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('200ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TeacherJournalsComponent implements OnInit { 
  private observable$: any;
  data: TeacherJournals[];

  constructor(
    private teacherJournals: TeacherPanelService,
    private store: Store<{ teacherPanel }>) {
      this.observable$ = this.store.pipe(select(selectAllJournals));
    };
    private columnsToDisplay: string[] = ['subjectName', 'className', 'academicYear'];
    // private expandedElement: TeacherJournals | null;
    private teacherJournalsList: any;


  // Get journals for teacher
  getJournals(): void {
    this.observable$.subscribe(response => {
    this.data = response;
    this.teacherJournalsList = new MatTableDataSource<TeacherJournals>(this.data);
    });
    if (!this.data) {
      this.teacherJournals.getTeacherJournalsService();
    }
  }

  putSelectedJournal(journal: object): void {
    this.teacherJournals.putSelectedJournalToStore(journal)
  }

  ngOnInit(){
    this.getJournals();
  }

}
