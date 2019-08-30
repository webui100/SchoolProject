import { Observable } from 'rxjs/internal/Observable';
import { SubjectsService } from './../../../services/subjects.service';
import { ClassesService } from 'src/app/services/classes.service';
import ClassModel from 'src/app/models/schoolclass.model';
import { IBindTeacher } from 'src/app/models/teacher.model';
import { TeachersService } from 'src/app/services/teachers.service';
import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getBindById } from 'src/app/store/teachers/teachers.selector';
import { FormBuilder, AbstractControl } from '@angular/forms';
import { selectAll } from 'src/app/store/subjects/subjects.selector';
import { selectClassesList } from 'src/app/store/classes/classes.selector';
import { map, startWith } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'webui-teacher-journal',
  templateUrl: './teacher-journal.component.html',
  styleUrls: ['./teacher-journal.component.scss']
})
export class TeacherJournalComponent implements OnInit, OnDestroy {
  @Input() teacherId: number;
  public teacherBindData: IBindTeacher[];
  private teachersBind$: Observable<any>;
  private subjects$: Observable<any>;
  private classes$: Observable<any>;
  public displayedColumns: string[] = ['subjectName', 'className'];
  private bindTeacherJournal: AbstractControl;
  private bindTeacherSubsc: Subscription;
  private subjectsSubsc: Subscription;
  private classesSubsc: Subscription;
  private filteredSubject$;

  constructor(
    private store: Store<object>,
    private teachServ: TeachersService,
    private formBuilder: FormBuilder,
    private classServ: ClassesService,
    private subjServ: SubjectsService
  ) {}

  createForm(): void {
    this.bindTeacherJournal = this.formBuilder.group({
      subjectsControl: [''],
      classesControl: [''],
    });
  }

  displaySubjectName(subject: any): string | undefined {
    return subject ? subject.subjectName : undefined;
  }

  displayClassesName(classes: any): string | undefined {
    return classes ? classes.className : undefined;
  }

  teacherJournalBind(e: Event) {
    e.preventDefault();
    const formValue = this.bindTeacherJournal.value;
    const data = {
      teacherId: this.teacherId,
      classData: formValue.classesControl,
      subjectData: formValue.subjectsControl,
    };
    this.teachServ.teacherJournalBind(data);
  }



  selectDataFromStore(): void {
    this.teachersBind$ = this.store.select(getBindById(this.teacherId));
    this.subjects$ = this.store.select(selectAll);
    this.classes$ = this.store.select(selectClassesList)
    .pipe(
      map(arr => {
      if (arr) {
      return arr.filter((elem: ClassModel) => {
        return elem.isActive;
      });
    }
    }));
  }

  getBindingList(): void {
    this.bindTeacherSubsc = this.teachersBind$
    .subscribe( (res: IBindTeacher) => {
      if (res !== undefined) {
        this.teacherBindData = res[this.teacherId];
      } else {
        this.teachServ.getTeacherBind(this.teacherId);
        this.teacherBindData = [];
      }
    });
  }

  getClassesList() {
    this.classesSubsc = this.classes$
    .subscribe(response => {
      if (!response) {
        this.classServ.getClasses();
      } else {
        this.classes$ = this.teachServ
          .autocompleteFilter(response, this.bindTeacherJournal,
          {
            controlName: 'classesControl',
            objProp: 'className'
          });
      }
    });
  }

  getSubjectsList() {
    this.subjectsSubsc = this.subjects$
    .subscribe(response => {
      if (!response) {
        this.subjServ.getSubjects();
      } else {
        this.subjects$ = this.teachServ
          .autocompleteFilter(response, this.bindTeacherJournal,
          {
            controlName: 'subjectsControl',
            objProp: 'subjectName'
          });
      }
    });
  }

  ngOnInit() {
    this.selectDataFromStore();
    this.createForm();
    this.getBindingList();
    this.getClassesList();
    this.getSubjectsList();
  }

  ngOnDestroy(): void {
    this.bindTeacherSubsc.unsubscribe();
    this.classesSubsc.unsubscribe();
    this.subjectsSubsc.unsubscribe();
  }


}
