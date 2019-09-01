import { TeachersService } from './../../services/teachers.service';
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
  private columnsToDisplay: string[] = [
    'lastname',
    'firstname',
    'patronymic',
    'delete'
  ];
  private expandedElement: ITeacher | null;
  private teachersList = new MatTableDataSource<ITeacher>();

  constructor(private teachServ: TeachersService,
              public dialog: MatDialog
              ) {}
  @Input() teachersData: ITeacher[];
  @Output() teachersSorting = new EventEmitter();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  // function for sorting, trim() remove spaces
  applyFilter(filterValue: string): void {
    this.teachersList.filter = filterValue.trim().toLowerCase();
  }

  sortOptions(options: object): void {
    this.teachersSorting.emit(options);
    this.fillTable();
  }

  private fillTable(): void {
    this.teachersList = new MatTableDataSource<ITeacher>(this.teachersData);
    this.teachersList.paginator = this.paginator;
  }

  deleteTeacher(e: Event, teacherId: number): void {
    e.stopPropagation();
    this.dialog.open(ModalDialogComponent, {
      data: {
        id: teacherId,
        message: 'Видалити користувача?',
        buttonText: 'Видалити'
      }
    });
  }

  sendTeacherList(): void {
    this.dialog.open(ModalDialogComponent, {
      data: {
        id: null,
        message: 'Відправити список вчителів на електронну почту?',
        buttonText: 'Відправити'
      }
    });
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
}
