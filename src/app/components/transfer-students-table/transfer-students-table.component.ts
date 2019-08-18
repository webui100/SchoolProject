import { HttpResponse } from '@angular/common/http';
import { TransitionService } from './../../services/transition.service';
import { Student } from '../../models/students';
import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'webui-transfer-students-table',
  templateUrl: './transfer-students-table.component.html',
  styleUrls: ['./transfer-students-table.component.scss']
})
export class TransferStudentsTableComponent implements OnInit {

  @Input() id: number;
  @Input() className: string;

  public students$: Observable<Object>;

  public displayedColumns = ['name', 'surname', 'patronymic']

  constructor(private transitionService: TransitionService) { }

  ngOnInit() {
    this.students$ = this.getStudents(this.id).pipe(
      //@ts-ignore
      map((value) => value.data)
    );
  }

  getStudents(id: number) {
    return this.transitionService.getStudents(id);
  }

}
