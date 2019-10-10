import { FormGroup } from '@angular/forms';
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
import { FormBuilder } from '@angular/forms';
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
  public bindTeacherJournal: FormGroup;

  constructor(
    private teachServ: TeachersService,
    private formBuilder: FormBuilder) {
      // create form
      this.bindTeacherJournal = this.formBuilder.group({
        subjectsControl: [''],
        classesControl: [''],
      });
    }

  // default material method for correct view option in selector
  displaySubjectName(subject: any): string | undefined {
    return subject ? subject.subjectName : undefined;
  }
  // default material method for correct view option in selector
  displayClassesName(classes: any): string | undefined {
    return classes ? classes.className : undefined;
  }
  // submit method, emit object with teacherId, classData and subjectData
  // for correct work with data in service
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

  // method check if data with journal exist
  // if true return current teacher journal binding
  getBindingList(): IBindTeacher[] {
    if (this.bindData.journalList) {
       return this.bindData.journalList[this.bindData.teacherId];
    }
  }

  // method check if data with subject list exist
  // if true return filtered value from autocomplete
  getSubjectsList(): Observable<string[]> {
    if (this.bindData.subjectList) {
     return this.teachServ
        .autocompleteFilter(this.bindData.subjectList, this.bindTeacherJournal, {
          controlName: 'subjectsControl',
          objProp: 'subjectName'
        });
    }
  }

  // method check if data with subject list exist
  // if true return filtered value from autocomplete
  getClassesList(): Observable<string[]> {
    if (this.bindData.classList) {
      return this.teachServ
        .autocompleteFilter(this.bindData.classList, this.bindTeacherJournal, {
          controlName: 'classesControl',
          objProp: 'className'
        });
    }
  }

  // checked if data doest exist, if true emit string with value which not have
  ngOnInit() {
    if (!this.bindData.classList) { this.getList.emit('class'); }
    if (!this.bindData.subjectList) { this.getList.emit('subject'); }
    if (!this.bindData.journalList) { this.getList.emit('journal'); }
  }

  // change value if data have some changes
  ngOnChanges(): void {
   this.teacherBindData = this.getBindingList();
   this.classes$ = this.getClassesList();
   this.subjects$ = this.getSubjectsList();
  }
}
