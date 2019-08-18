import { Teacher } from '../../models/teacher.model';
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

@Component({
  selector: 'webui-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss'],
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
export class TeachersComponent implements OnInit {
  private columnsToDisplay: string[] = ['firstname', 'lastname', 'dateOfBirth'];
  private expandedElement: Teacher | null;
  private teachersList: MatTableDataSource<Teacher>;
  private direction: string;

  constructor() {}
  @Input() teachersPristine: Teacher[];
  @Output() teachersSorting = new EventEmitter();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  private fillTable(): void {
      this.teachersList = new MatTableDataSource<Teacher>(this.teachersPristine);
      this.teachersList.paginator = this.paginator;
  }

  // function for sorting, trim() remove spaces
  private applyFilter(filterValue: string): void {
    this.teachersList.filter = filterValue.trim().toLowerCase();
  }

  sortSetting(e: any, columnName: string) {
    const currentDirection = e.target.getAttribute('data-nextDirection');
    this.teachersSorting.emit({direction: currentDirection, column: columnName});

    const nextDirection = currentDirection === 'desc' ? 'asc' : 'desc';
    e.target.setAttribute('data-nextDirection', nextDirection);
    this.fillTable();
  }

  ngOnInit(): void {
    this.fillTable();
  }


  // switcher for table header with UA text
  private dataHeader(header: string) {
    switch (header) {
      case 'firstname':
        return 'Ім\'я';
      case 'lastname':
        return 'Прізвище';
      case 'dateOfBirth':
        return 'Дата народження';
    }
  }
}
