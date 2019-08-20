import { sortColumn, deleteTeacher } from 'src/app/store/teachers/teachers.action';
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
import { Store } from '@ngrx/store';


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
  private columnsToDisplay: string[] = ['firstname', 'lastname', 'dateOfBirth', 'bind', 'delete'];
  private expandedElement: Teacher | null;
  private teachersList = new MatTableDataSource<Teacher>();


  constructor(private teachServ: TeachersService,
              private store: Store<object>) {}
  @Input() teachersData: Teacher[];
  @Output() teachersSorting = new EventEmitter();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  // function for sorting, trim() remove spaces
  private applyFilter(filterValue: string): void {
    this.teachersList.filter = filterValue.trim().toLowerCase();
  }


  sortOptions(options: object): void {
    this.teachersSorting.emit(options);
    this.fillTable();
  }

  deleteTeacher(e, teacherId: number): void {
    e.stopPropagation();
    this.teachServ.deleteTeacher(teacherId);
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
