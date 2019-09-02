import { Component, OnInit } from '@angular/core';
import { TeacherSubject } from '../../models/teacher-subjects';
import { TeacherSubjectsService } from '../../services/teacher-subjects.service';
import { selectAll } from "../../store/teacher-subjects/teacher-subjects.selector";
import { Store, select } from "@ngrx/store";
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'webui-teacher-subjects',
  templateUrl: './teacher-subjects.component.html',
  styleUrls: ['./teacher-subjects.component.scss']
})

export class TeacherSubjectsComponent implements OnInit {
    private data$: any;
    data: TeacherSubject[];

    constructor(
      private teacherSubjects: TeacherSubjectsService,
      private store: Store<{ teacherSubjects }>) {
        this.data$ = this.store.pipe(select(selectAll));
      };
      private columnsToDisplay: string[] = ['subjectName', 'subjectDescription'];
      private teacherSubjectsList: any;


    // Get subjects for teacher
    getSubjects(): void {
      this.data$.subscribe(response => {
      this.data = response;
      this.teacherSubjectsList = new MatTableDataSource<TeacherSubject>(this.data);
      });
      this.teacherSubjects.getTeacherSubjectsService();
    }

    ngOnInit(){    
      this.getSubjects();
    } 
  }
