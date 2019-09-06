import { SubjectsService } from '../../services/subjects.service';
import { ClassesService } from '../../services/classes.service';
import { ITeacher } from '../../models/teacher.model';
import { Component, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { getAllBindInfo } from 'src/app/store/teachers/teachers.selector';

import { TeachersService } from 'src/app/services/teachers.service';

@Component({
  selector: 'webui-teacher-detail-container',
  templateUrl: './teacher-detail-container.component.html',
  styleUrls: ['./teacher-detail-container.component.scss']
})
export class TeacherDetailContainerComponent implements OnInit {
  @Input() teacher: ITeacher;
  public fullData;

  constructor(private store: Store<object>,
              private teachServ: TeachersService,
              private classServ: ClassesService,
              private subjServ: SubjectsService) {
              }

  ngOnInit() {
    this.fullData = this.store.pipe(select(getAllBindInfo(this.teacher.id)));
    //this.classServ.getClasses();
    //this.subjServ.getSubjects();
    //this.teachServ.getTeacherBind(this.teacher.id);
  }

  getData(value: any) {
    if (typeof value === 'string') {
    switch (value) {
      case 'class':
        this.classServ.getClasses();
        break;
      case 'subject':
        this.subjServ.getSubjects();
        break;
      case 'journal':
        this.teachServ.getTeacherBind(this.teacher.id);
        break;
    }
  } else {
    this.teachServ.teacherJournalBind(value);
  }
  }
  }
