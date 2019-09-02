import { ITeacher } from '../../../models/teacher.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'webui-teacher-detail-container',
  templateUrl: './teacher-detail-container.component.html',
  styleUrls: ['./teacher-detail-container.component.scss']
})
export class TeacherDetailContainerComponent implements OnInit {
  @Input() teacher: ITeacher;
  constructor(){}
  ngOnInit() {
  }

}
