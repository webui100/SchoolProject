import { IMarkType } from 'src/app/models/mark-type.model';
import { Component, OnInit, Input, ViewChild, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
  selector: 'webui-disabled-marks',
  templateUrl: './disabled-marks.component.html',
  styleUrls: ['./disabled-marks.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      )
    ])
  ]
})
export class DisabledMarksComponent implements OnInit, OnChanges {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @Input() disabledMarksList: IMarkType[]; // input accept disable mark
  @Output() editMark = new EventEmitter(); // outpu emit data with edited disabled mark
  private marksListDis;
  public columnsToDisplay: string[] = [
    'markType',
    'description'
  ];
  // method emit data with edited mark 
  putMark(data: IMarkType) {
    this.editMark.emit(data);
  }

  private fillTable(): void {
    this.marksListDis = new MatTableDataSource<IMarkType>(this.disabledMarksList);
    this.marksListDis.paginator = this.paginator;
  }

  ngOnInit() {
   this.fillTable();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.fillTable();
  }

}
