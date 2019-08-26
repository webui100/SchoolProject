import { Subscription } from 'rxjs';
import { IBindTeacher } from 'src/app/models/teacher.model';
import { TeachersService } from 'src/app/services/teachers.service';
import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getBindById } from 'src/app/store/teachers/teachers.selector';

@Component({
  selector: 'webui-teacher-journal',
  templateUrl: './teacher-journal.component.html',
  styleUrls: ['./teacher-journal.component.scss']
})
export class TeacherJournalComponent implements OnInit, OnDestroy {
  @Input() teacherId: number;
  public teacherBindData: IBindTeacher[];
  private unsub: Subscription;
  displayedColumns: string[] = ['subjectName', 'className'];
  constructor(
    private store: Store<object>,
    private teachServ: TeachersService,
  ) {}

  ngOnInit() {
    this.unsub = this.store.select(getBindById(this.teacherId))
    .subscribe( (res: IBindTeacher) => {
      if (res !== undefined) {
        this.teacherBindData = res.bindTeacher;
      } else {
        this.teachServ.getTeacherBind(this.teacherId);
        this.teacherBindData = [];
      }
    });
  }

  ngOnDestroy(): void {
    this.unsub.unsubscribe();
  }




}
