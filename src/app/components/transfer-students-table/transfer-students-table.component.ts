import { Student } from '../../models/students';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'webui-transfer-students-table',
  templateUrl: './transfer-students-table.component.html',
  styleUrls: ['./transfer-students-table.component.scss']
})
export class TransferStudentsTableComponent implements OnInit {

  @Input() studentsList: Array<Student>;
  @Input() className: string;

  public displayedColumns = ['name', 'surname', 'patronymic']

  constructor() { }

  ngOnInit() {
    
  }

}
