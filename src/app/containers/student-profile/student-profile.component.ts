import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, Validators, AbstractControl } from "@angular/forms";
import { Store, select } from "@ngrx/store";
import { Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { MatDialogRef } from "@angular/material/dialog";
import { format, subYears } from "date-fns";

import { Student } from "../../models/profile.model";
import { StudentProfileService } from "../../services/student-profile.service";
import { ValidationService } from "../../services/validation.service";
import { selectStudentProfile } from "../../store/profile/profile.selectors";

@Component({
  selector: "webui-student-profile",
  templateUrl: "./student-profile.component.html",
  styleUrls: ["./student-profile.component.scss"]
})
export class StudentProfileComponent implements OnInit, OnDestroy {
  private student: Student;
  private profile: AbstractControl;
  private maxDate = subYears(new Date(), 6);
  private avatar: string | ArrayBuffer;
  private avatar$: Subscription;
  private fileToUpload: string | ArrayBuffer;
  private destroyStream$ = new Subject<void>();

  constructor(
    private studentProfile: StudentProfileService,
    private validationService: ValidationService,
    private store: Store<{ profile }>,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<StudentProfileComponent>
  ) {
    this.store
      .pipe(select(selectStudentProfile))
      .pipe(takeUntil(this.destroyStream$))
      .subscribe(student => (this.student = student));
  }

  ngOnInit(): void {
    this.fetchProfile();
    this.avatar = this.student.avatar
      ? this.student.avatar
      : "../../../assets/images/no-user-image.png";
  }

  ngOnDestroy(): void {
    this.destroyStream$.next();
  }

  fetchProfile(): void {
    this.profile = this.formBuilder.group({
      firstname: [
        this.student.firstname ? this.student.firstname : this.student.firstName
      ],
      lastname: [
        this.student.lastname ? this.student.lastname : this.student.lastName
      ],
      patronymic: [this.student.patronymic],
      login: [this.student.login],
      dateOfBirth: [this.student.dateOfBirth, [Validators.required]],
      email: [
        this.student.email,
        [Validators.pattern(this.validationService.emailRegExp)]
      ],
      phone: [
        this.student.phone,
        [Validators.pattern(this.validationService.phoneRegExp)]
      ],
      oldPass: [
        "",
        [Validators.pattern(this.validationService.passwordRegExp)]
      ],
      newPass: [""]
    });
  }

  changeAvatar(event): void {
    this.studentProfile.readImage(event.target);
    this.avatar$ = this.studentProfile.subject.subscribe(response => {
      this.avatar = response;
      this.fileToUpload = response;
      this.avatar$.unsubscribe();
    });
  }

  onSubmit(): void {
    const profile = this.profile.value;
    profile.avatar = this.fileToUpload
      ? this.fileToUpload
      : this.student.avatar;
    profile.dateOfBirth = format(new Date(profile.dateOfBirth), "YYYY-MM-DD");
    this.studentProfile.editProfile(profile);
    this.dialogRef.close();
  }
}
