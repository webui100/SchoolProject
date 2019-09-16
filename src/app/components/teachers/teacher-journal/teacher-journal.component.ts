import { IBindTeacher } from '../../../models/teacher.model';
import { TeachersService } from 'src/app/services/teachers.service';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { FormBuilder, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'webui-teacher-journal',
  templateUrl: './teacher-journal.component.html',
  styleUrls: ['./teacher-journal.component.scss']
})
export class TeacherJournalComponent implements OnInit, OnChanges {
  @Input() bindData: any;
  @Output() getList = new EventEmitter();

  public teacherBindData: IBindTeacher[];
  public classes$: Observable<string[]>;
  public subjects$: Observable<string[]>;
  public displayedColumns: string[] = ['subjectName', 'className'];
  private bindTeacherJournal: AbstractControl;

  constructor(
    private teachServ: TeachersService,
    private formBuilder: FormBuilder) {
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

  submitJournalBind(e: Event) {
    e.preventDefault();
    const formValue = this.bindTeacherJournal.value;
    const data = {
      teacherId: this.bindData.teacherId,
      classData: formValue.classesControl,
      subjectData: formValue.subjectsControl,
    };
    this.getList.emit(data);
  }

  getBindingList(): IBindTeacher[] {
    if (this.bindData.journalList) {
       return this.bindData.journalList[this.bindData.teacherId];
    }
  }

  getSubjectsList(): Observable<string[]> {
    if (this.bindData.subjectList) {
     return this.teachServ
        .autocompleteFilter(this.bindData.subjectList, this.bindTeacherJournal, {
          controlName: 'subjectsControl',
          objProp: 'subjectName'
        });
    }
  }

  getClassesList(): Observable<string[]> {
    if (this.bindData.classList) {
      return this.teachServ
        .autocompleteFilter(this.bindData.classList, this.bindTeacherJournal, {
          controlName: 'classesControl',
          objProp: 'className'
        });
    }
  }

  ngOnInit() {
    if (!this.bindData.classList) { this.getList.emit('class'); }
    if (!this.bindData.subjectList) { this.getList.emit('subject'); }
    if (!this.bindData.journalList) { this.getList.emit('journal'); }
  }

  ngOnChanges(): void {
   this.teacherBindData = this.getBindingList();
   this.classes$ = this.getClassesList();
   this.subjects$ = this.getSubjectsList();
  }
}
