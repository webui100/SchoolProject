import { TeachersService } from 'src/app/services/teachers.service';
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { selectTeachers } from 'src/app/store/teachers/teachers.selector';
import { Observable } from 'rxjs';

@Component({
  selector: 'webui-teachers-container',
  templateUrl: './teachers-container.component.html',
  styleUrls: ['./teachers-container.component.scss']
})
export class TeachersContainerComponent {
  private teachersList$: Observable<object[]>;

  constructor(private store: Store<object>) {
    this.teachersList$ = this.store.pipe(select(selectTeachers));
  }
}
