import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { IMarkType } from 'src/app/models/mark-type.model';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'webui-mark-component',
  templateUrl: './mark-component.component.html',
  styleUrls: ['./mark-component.component.scss'],
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
export class MarkComponentComponent implements OnInit, OnChanges {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @Input() marksData: IMarkType[];
  @Input() marksDisabled: IMarkType[];
  @Output() editMark = new EventEmitter();
  @Output() getMarks = new EventEmitter();
  @Output() createMark = new EventEmitter();

  private marksList;
  public expandedElement: IMarkType[] | null;
  public columnsToDisplay: string[] = [
    'markType',
    'description'
  ];
  constructor() { }


  private fillTable(): void {
    this.marksList = new MatTableDataSource<IMarkType>(this.marksData);
    this.marksList.paginator = this.paginator;
  }

  postMark(data) {
    this.createMark.emit(data);
  }

  putMark(data) {
    this.editMark.emit(data);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.fillTable();
  }

  ngOnInit() {
    if (this.marksData.length === 0) {
      this.getMarks.emit(null);
    }
    this.fillTable();
  }
}
