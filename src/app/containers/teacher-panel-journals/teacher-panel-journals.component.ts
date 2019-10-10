import { Component, OnInit } from '@angular/core';
import { TeacherJournals } from '../../models/teacher-panel.model';
import { TeacherPanelService } from '../../services/teacher-panel.service';
import { selectAllJournals } from "../../store/teacher-panel/teacher-panel.selector";
import { Store, select } from "@ngrx/store";
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'webui-teacher-panel-journals',
  templateUrl: './teacher-panel-journals.component.html',
  styleUrls: ['./teacher-panel-journals.component.scss']
})
export class TeacherJournalsComponent implements OnInit { 
  private observable$: any;

  constructor(
    private teacherJournals: TeacherPanelService,
    private store: Store<{ teacherPanel }>
  ) {
    this.observable$ = this.store.pipe(select(selectAllJournals));
  };

    private columnsToDisplay: string[] = ['subjectName', 'className', 'academicYear'];
    private teacherJournalsList: any;

  ngOnInit(){
    this.getJournals();
  }

  // Get journals for teacher
  getJournals(): void {
    this.observable$.subscribe(response => {
      if (!response) {
        this.teacherJournals.getTeacherJournalsService();
      }
      this.teacherJournalsList = new MatTableDataSource<TeacherJournals>(response);
    });
  }

  putSelectedJournal(journal: object): void {
    this.teacherJournals.putSelectedJournalToStore(journal)
  }
}