import { TeachersService } from './../../services/teachers.service';
import { Teacher } from '../../models/teacher.model';
import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
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
export class TeachersComponent implements OnInit, OnChanges {
  private columnsToDisplay: string[] = ['firstname', 'lastname', 'dateOfBirth', 'delete'];
  private expandedElement: Teacher | null;
  private teachersList = new MatTableDataSource<Teacher>();
  private nextDirection: string;
  private ascending = true;


  constructor(private teachServ: TeachersService) {}
  @Input() teachersData: Teacher[];
  @Output() teachersSorting = new EventEmitter();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  // function for sorting, trim() remove spaces
  private applyFilter(filterValue: string): void {
    this.teachersList.filter = filterValue.trim().toLowerCase();
  }

  sortSetting(e: any, columnName: string) {
    const currentDirection = e.target.getAttribute('data-nextDirection');
    this.teachersSorting.emit({
      direction: currentDirection,
      column: columnName
    });
    this.fillTable();
    this.nextDirection = currentDirection === 'desc' ? 'asc' : 'desc';
    e.target.setAttribute('data-nextDirection', this.nextDirection);
    this.ascending = !this.ascending;
  }

  fillTable(): void {
    this.teachersList = new MatTableDataSource<Teacher>(this.teachersData);
    this.teachersList.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.fillTable();
    if (this.teachersData === undefined) {
      this.teachServ.getTeachers();
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
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
