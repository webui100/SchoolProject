import { Component, OnInit } from '@angular/core';
import { TeacherSubjects } from '../../models/teacher-panel.model';
import { TeacherPanelService } from '../../services/teacher-panel.service';
import { selectAllSubjects } from "../../store/teacher-panel/teacher-panel.selector";
import { Store, select } from "@ngrx/store";
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: "webui-teacher-panel-subjects",
  templateUrl: "./teacher-panel-subjects.component.html",
  styleUrls: ["./teacher-panel-subjects.component.scss"]
})

export class TeacherSubjectsComponent implements OnInit {
    private observable$: any;
    data: TeacherSubjects[];

    constructor(
      private teacherSubjects: TeacherPanelService,
      private store: Store<{ teacherPanel }>) {
        this.observable$ = this.store.pipe(select(selectAllSubjects));
      };
      private columnsToDisplay: string[] = ['subjectName', 'subjectDescription'];
      private teacherSubjectsList: any;


    // Get subjects for teacher
    getSubjects(): void {
      this.observable$.subscribe(response => {
      this.data = response;
      this.teacherSubjectsList = new MatTableDataSource<TeacherSubjects>(this.data);
      });
      if (!this.data) {
        this.teacherSubjects.getTeacherSubjectsService();
      }
    }

    ngOnInit(){    
      this.getSubjects();
    } 
  }
