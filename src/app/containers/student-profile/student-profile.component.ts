import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { format, subYears } from 'date-fns';

import { StudentProfileService } from '../../services/student-profile.service';
import { selectStudentProfile } from '../../store/profile/profile.selectors';
import { Student } from '../../models/profile.model';

@Component({
  selector: 'webui-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit, OnDestroy {

  private student: Student;
  private profile: AbstractControl;
  private maxDate = subYears(new Date(), 6);
  private avatar: string | ArrayBuffer;
  private subscriptAvatar: Subscription;
  private fileToUpload: string | ArrayBuffer;
  private destroyStream$ = new Subject<void>();

  constructor(
    private studentProfile: StudentProfileService,
    private store: Store<{ profile }>,
    private formBuilder: FormBuilder
  ) {
    this.store.pipe(select(selectStudentProfile))
      .subscribe(student => this.student = student);
  }

  ngOnInit(): void {
    this.fetchProfile();
    this.avatar = this.student.avatar
      ? this.student.avatar
      : '../../../assets/images/no-user-image.png';
  }

  ngOnDestroy(): void {
    this.destroyStream$.next();
  }

  fetchProfile(): void {
    this.profile = this.formBuilder.group({
      firstname: [this.student.firstname, [Validators.required]],
      lastname: [this.student.lastname, [Validators.required]],
      patronymic: [this.student.patronymic, [Validators.required]],
      dateOfBirth: [this.student.dateOfBirth, Validators.required],
      email: [this.student.email],
      phone: [this.student.phone],
      login: [this.student.login],
      oldPass: [''],
      newPass: ['']
    });
  }

  changeAvatar(event): void {
    this.studentProfile.readImage(event.target);
    this.subscriptAvatar = this.studentProfile.subject.subscribe(response => {
      this.avatar = response;
      this.fileToUpload = response;
      this.subscriptAvatar.unsubscribe();
    });
  }

  onSubmit(): void {
    const profile = this.profile.value;
    profile.avatar = this.fileToUpload ? this.fileToUpload : this.student.avatar;
    profile.dateOfBirth = format(new Date(profile.dateOfBirth), 'YYYY-MM-DD');
    this.studentProfile.editProfile(profile);
  }
}
