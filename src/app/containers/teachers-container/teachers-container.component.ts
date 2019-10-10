import { ITeacher } from 'src/app/models/teacher.model';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { teachersSortByName } from 'src/app/store/teachers/teachers.selector';
import { Observable } from 'rxjs';
import { sortColumn } from 'src/app/store/teachers/teachers.action';

@Component({
  selector: 'webui-teachers-container',
  templateUrl: './teachers-container.component.html',
  styleUrls: ['./teachers-container.component.scss']
})
export class TeachersContainerComponent implements OnInit {
  private teachersList$: Observable<ITeacher[]>;

  constructor(private store: Store<object>) {}

  // method select teachers list from store in with sorting options
  teachersSorting(options) {
    this.store.dispatch(sortColumn({ sortOptions: options }));
    this.teachersList$ = this.store.select(teachersSortByName);
  }

  ngOnInit() {
    this.teachersList$ = this.store.select(teachersSortByName);
  }
}
