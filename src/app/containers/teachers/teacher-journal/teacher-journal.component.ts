import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectTeacherBind } from 'src/app/store/teachers/teachers.selector';

@Component({
  selector: 'webui-teacher-journal',
  templateUrl: './teacher-journal.component.html',
  styleUrls: ['./teacher-journal.component.scss']
})
export class TeacherJournalComponent implements OnInit {
  @Input() teacherId: number;
  private bindData;
  private unsub;
  constructor(private store: Store<object>) { }

  ngOnInit() {
    this.unsub = this.store.select(selectTeacherBind)
    .subscribe(res => {
      this.bindData = res.map((el) => {
        if (el !== undefined) {
          return el.bindTeacher[0];
        }
      }) || [];
    });
  }

  // ngOnDestroy(): void {
  //   this.unsub.unsubscribe();
  // }

}
