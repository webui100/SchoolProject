import { Store, select } from '@ngrx/store';
import { Teacher } from '../../models/teacher';
import { TeachersService } from '../../services/teachers.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { selectTeachers } from '../../store/teachers/teachers.selector';
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
  private data$: any;
  data: Teacher[];

  constructor(private teachers: TeachersService, private store: Store<{}>) {
    this.data$ = this.store.pipe(select(selectTeachers));
  }

  private columnsToDisplay: string[] = ['firstname', 'lastname', 'dateOfBirth']; // header for TH
  private expandedElement: Teacher | null; // for expanded row
  private teachersList: any; // list of teacher

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator; // View child pulls out DOM element
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  /* function make subscribe and initializes "data",
  then convert data for correct view in table
  add a pagintator and sorting*/
  getTeachers() {
    this.data$.subscribe(response => {
      this.data = response.teachersList;
      this.teachersList = new MatTableDataSource<Teacher>(this.data);
      if (this.data !== null) {
        this.teachersList.paginator = this.paginator;
        this.teachersList.sort = this.sort;
      }
    });
    if (!this.data) {
      this.teachers.getTeachers();
    }
  }

  // function for sorting, trim() remove spaces
  private applyFilter(filterValue: string) {
    this.teachersList.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.getTeachers();
  }

  // switcher for table header with ua text
  private dataHeader(header) {
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
