import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from '../../models/subjects';
import { SubjectsService } from '../../services/subjects.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { Store, select } from "@ngrx/store";
import { selectAll } from "../../store/subjects/subjects.selector";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'webui-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss'], 
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('200ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class SubjectsComponent implements OnInit {
  private data$: any;
  data: Subject[];
  subject: Subject;
  addSubject: FormGroup;
  expandStatus = false;
  editSubject: FormGroup = new FormGroup({
    subjectName: new FormControl(''),
    subjectDescription: new FormControl(''),
    subjectId: new FormControl('')
  })


  constructor(private subjects: SubjectsService,
    private store: Store<{ subjects }>,
    private subjectsService: SubjectsService) {
      this.data$ = this.store.pipe(select(selectAll));
    };
    private columnsToDisplay: string[] = ['subjectName', 'subjectDescription'];
    private expandedElement: Subject | null;
    private subjectsList: any;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  // Get all subjects
  getSubjects(): void {
    this.data$.subscribe(response => {
    this.data = response;
    this.subjectsList = new MatTableDataSource<Subject>(this.data);
    if (this.data !== null) {
      this.subjectsList.sort = this.sort;
      this.subjectsList.paginator = this.paginator;
    }
    });
    if (!this.data) {
      this.subjects.getSubjects();
    }
  }

  // Filter
  private applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    this.subjectsList.filter = filterValue;
  }

  // Adding
  createAddForm(): void {
    this.addSubject = new FormGroup({
      subjectName: new FormControl(''),
      subjectDescription: new FormControl(''),
    });
  }
  submitAdd($event): void {
    const data: Subject = this.addSubject.value;
    this.subjectsService.addSubject(data);
    this.expandStatus = this.expandStatus?false:true;
    this.createAddForm();
  }

  // Editing
  createEditForm(subject: Subject): void {
    this.editSubject = new FormGroup({
      subjectName: new FormControl(subject.subjectName),
      subjectDescription: new FormControl(subject.subjectDescription),
      subjectId: new FormControl(subject.subjectId)
    });
  }
  submitEdit($event): void {
    const data: Subject = this.editSubject.value;
    this.subjectsService.editSubject(data.subjectId, data);
  }

  ngOnInit(){    
    this.getSubjects();
    this.createAddForm();
  } 
}

