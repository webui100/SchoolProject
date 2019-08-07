import { Student } from "../../models/students";
import { StudentsService } from "../../services/students.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Store, select } from "@ngrx/store";
import { selectStudentsData } from "../../store/students/students.selector";

import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";

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
export class StudentsComponent implements OnInit {
  dataSource: MatTableDataSource<Student>;
  students$;
  columnsToDisplay = ["firstname", "lastname", "patronymic"];

  expandedElement: Student | null;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataHeader(header) {
    switch (header) {
      case "firstname":
        return "Ім'я";
      case "lastname":
        return "Прізвище";
      case "patronymic":
        return "По-батькові";
    }
  }
  constructor(
    private studentsService: StudentsService,
    private store: Store<{ students }>
  ) {
    this.students$ = this.store.pipe(select(selectStudentsData));
  }
  loadStudents(){
    this.studentsService.getStudents(17);
    this.students$.subscribe(data => {
      const checkData = data.students
      this.dataSource = new MatTableDataSource(checkData);
      if(data!=null){
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort; 
      }
    });
  }
  ngOnInit() {
    if(this.students$){
      this.loadStudents();
    }

    
  }
  
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
