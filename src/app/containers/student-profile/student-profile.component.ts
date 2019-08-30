import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { StudentProfileService } from '../../services/student-profile.service';
import { selectStudentProfile } from '../../store/profile/profile.selectors';
import { Student } from '../../models/profile.model';

@Component({
  selector: 'webui-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit, OnDestroy {

  profile$: Observable<Student>;
  profile: any;
  destroyStream$ = new Subject<void>();

  constructor(
    private studentProfile: StudentProfileService,
    private store: Store<{ profile }>
  ) {
    this.profile$ = this.store.pipe(select(selectStudentProfile));
  }

  ngOnInit(): void {
    this.studentProfile.fetchProfile();
  }

  ngOnDestroy(): void {
    this.destroyStream$.next();
  }
}
