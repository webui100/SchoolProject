import {
  selectTeachers,
  selectTeachersByName
} from './../../store/teachers/teachers.selector';
import { Store, select } from '@ngrx/store';
import { Teacher } from '../../models/teacher.model';
import { TeachersService } from '../../services/teachers.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
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
export class TeachersComponent implements OnInit, OnDestroy {
  private teachersList$: any;
  private columnsToDisplay: string[] = ['firstname', 'lastname', 'dateOfBirth'];
  private expandedElement: Teacher | null;
  private teachersList: MatTableDataSource<Teacher>;

  constructor(private teachers: TeachersService,
              private store: Store<{}>) {
    this.teachersList$ = this.store.pipe(select(selectTeachersByName));
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator; 

  /* function make subscribe and initializes "data",
  then convert data for correct view in table
  add a pagintator and sorting*/
  getTeachers() {
    if (!this.teachersList) {
      this.teachers.getTeachers();
    }
    return this.teachersList$.subscribe(
    (response: Teacher[]) => {
      this.teachersList = new MatTableDataSource<Teacher>(response);
      this.teachersList.paginator = this.paginator;
    },
    (error: Error) => {
      throw error;
    });
  }

  // function for sorting, trim() remove spaces
  private applyFilter(filterValue: string): void {
    this.teachersList.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.getTeachers();
  }
  ngOnDestroy(): void {
    this.teachersList$.unsubscribe();
  }

  // switcher for table header with ua text
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
