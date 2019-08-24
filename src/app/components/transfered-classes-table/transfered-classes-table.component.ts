import { Component, OnInit, Input } from '@angular/core';
import ClassModel from 'src/app/models/schoolclass.model';

@Component({
  selector: 'webui-transfered-classes-table',
  templateUrl: './transfered-classes-table.component.html',
  styleUrls: ['./transfered-classes-table.component.scss']
})
export class TransferedClassesTableComponent implements OnInit {

  @Input() transferedClasses: Array<ClassModel>;

  public classesFields = ['className', 'numOfStudents', 'classYear']

  constructor() { }

  ngOnInit() {
  }

}
