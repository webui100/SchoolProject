import { Student } from "../../models/students";
import { StudentsService } from "../../services/students.service";
import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Store, select } from "@ngrx/store";
import { selectStudentsData } from "../../store/students/students.selector";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";

import { filter } from "rxjs/operators";

/**
 * @title Table with expandable rows
 */
@Component({
  selector: "webui-students",
  templateUrl: "./students.component.html",
  styleUrls: ["./students.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      )
    ])
  ]
})
export class StudentsComponent implements OnInit, OnDestroy {
  private data: MatTableDataSource<Object>;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private columnsToDisplay: String[] = [
    "lastname",
    "firstname",
    "patronymic",
    "delete"
  ];

  private expandedElement: Student | null;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  applyFilter(filterValue: string) {
    this.data.filter = filterValue.trim().toLowerCase();

    if (this.data.paginator) {
      this.data.paginator.firstPage();
    }
  }

  constructor(
    private studentsService: StudentsService,
    private store: Store<{ students }>
  ) {}

  private loadStudents() {
    this.store
      .pipe(
        select(selectStudentsData),
        filter(val => val != null && val != undefined),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(data => {
        if (!data.students) {
          this.studentsService.getStudents(17);
        } else {
          this.data = new MatTableDataSource(data.students);
          this.data.paginator = this.paginator;
          this.data.sort = this.sort;
        }
      });
  }

  private onDelete(id: number) {
    this.studentsService.deleteStudent(id);
  }
  ngOnInit() {
    this.loadStudents();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
