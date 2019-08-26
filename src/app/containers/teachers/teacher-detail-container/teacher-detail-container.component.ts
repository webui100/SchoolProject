import { ITeacher } from './../../../models/teacher.model';
import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { TeachersService } from 'src/app/services/teachers.service';

@Component({
  selector: 'webui-teacher-detail-container',
  templateUrl: './teacher-detail-container.component.html',
  styleUrls: ['./teacher-detail-container.component.scss']
})
export class TeacherDetailContainerComponent implements OnInit {
  @Input() teacher: ITeacher;
  private teacherBindData$;
  constructor(private store: Store<object>,
              private teachServ: TeachersService) { }

  ngOnInit() {
  }

}
