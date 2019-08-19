import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { teachersSortByName } from 'src/app/store/teachers/teachers.selector';
import { Observable } from 'rxjs';
import { sortColumn } from 'src/app/store/teachers/teachers.action';

@Component({
  selector: 'webui-teachers-container',
  templateUrl: './teachers-container.component.html',
  styleUrls: ['./teachers-container.component.scss']
})
export class TeachersContainerComponent {
  private teachersList$: Observable<object[]>;

  constructor(private store: Store<object>) {
    this.teachersList$ = this.store.pipe(select(teachersSortByName));
  }
  teachersSorting() {
    this.teachersList$ = this.store.pipe(select(teachersSortByName));
  }
}
