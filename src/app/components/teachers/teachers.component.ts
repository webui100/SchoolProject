import { TeachersService } from '../../services/teachers.service';
import { ITeacher } from '../../models/teacher.model';
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
import { MatDialog } from '@angular/material';
import { ModalDialogComponent } from 'src/app/components/modal-dialog/modal-dialog.component';

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
  private columnsToDisplay: string[] = [   // array with string for table headers
    'lastname',
    'firstname',
    'patronymic',
    'delete'
  ];
  private expandedElement: ITeacher | null;
  private teachersList = new MatTableDataSource<ITeacher>(); // instance mat table data source

  constructor(private teachServ: TeachersService,
              public dialog: MatDialog
              ) {}
  @Input() teachersData: ITeacher[]; // input with list of teachers from store
  @Output() teachersSorting = new EventEmitter(); // emit storting options with current column and direction
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator; // material paginator

  // method for sorting, trim() remove spaces, default material search
  applyFilter(filterValue: string): void {
    this.teachersList.filter = filterValue.trim().toLowerCase();
  }

  // method for emitting sorting options
  sortOptions(options: object): void {
    this.teachersSorting.emit(options);
    this.fillTable(); // refresh table data
  }

  // method refresh table data after changes
  private fillTable(): void {
    this.teachersList = new MatTableDataSource<ITeacher>(this.teachersData);
    this.teachersList.paginator = this.paginator;
  }

  // method accepts event and teacherId,
  // call modal window with comfirmation
  deleteTeacher(e: Event, teacherId: number): void {
    e.stopPropagation();
    this.dialog.open(ModalDialogComponent, {
      data: { // options for correct view modal window
        id: teacherId,
        message: 'Видалити користувача?',
        buttonText: 'Видалити'
      }
    });
  }

  // method send teacher list data to admin email
  sendTeacherList(): void {
    this.dialog.open(ModalDialogComponent, {
      data: { // options for correct view modal window
        id: null,
        message: 'Відправити список вчителів на електронну почту?',
        buttonText: 'Відправити'
      }
    });
  }

  // fill table and check if data is exist
  ngOnInit(): void {
    this.fillTable();
    if (this.teachersData === undefined) {
      this.teachServ.getTeachers(); // request to server
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.fillTable(); // refresh table if something data change
  }
}
