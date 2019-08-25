import { Subject, Subscription } from 'rxjs';
import { Component, OnInit, Input, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import ClassModel from 'src/app/models/schoolclass.model';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'webui-transfered-classes-table',
  templateUrl: './transfered-classes-table.component.html',
  styleUrls: ['./transfered-classes-table.component.scss']
})
export class TransferedClassesTableComponent implements OnInit, OnChanges {
  @Input() transferedClasses: Array<ClassModel>;
  matDataSubject = new Subject<Array<ClassModel>>();
  matDataSubjectRef: Subscription;
  dataSource: MatTableDataSource<any>;


  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  public classesFields = ['className', 'numOfStudents', 'classYear']

  constructor() { }

  ngOnInit() {
    this.matDataSubjectRef = this.matDataSubject.subscribe((value) => {
      this.dataSource = new MatTableDataSource<any>(value);
      this.dataSource.paginator = this.paginator;
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.matDataSubject.next(changes.transferedClasses.currentValue);
  }

  ngOnDestroy(): void {
    this.matDataSubjectRef.unsubscribe();
  }
}
