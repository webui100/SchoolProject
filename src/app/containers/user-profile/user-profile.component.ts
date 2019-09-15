import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, ErrorStateMatcher, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { format, subYears } from 'date-fns';

import { User } from '../../models/user.model';
import { UserProfileService } from '../../services/user-profile.service';
import { ValidationService } from '../../services/validation.service';
import { selectCurrentUser } from '../../store/current-user/current-user.selector';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.parent && control.dirty && control.invalid);
    const invalidParent = !!(control && control.parent && control.dirty && control.parent.invalid);
    return (invalidCtrl || invalidParent);
  }
}

@Component({
  selector: 'webui-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'uk-UK'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}
  ]
})
export class UserProfileComponent implements OnInit, OnDestroy {

  private user: User;
  private profile: AbstractControl | FormGroup;
  private maxDate = subYears(new Date(), 6);
  private avatar: string | ArrayBuffer;
  private avatar$: Subscription;
  private fileToUpload: string | ArrayBuffer;
  private destroyStream$ = new Subject<void>();
  private matcher = new MyErrorStateMatcher();

  constructor(
    private userProfile: UserProfileService,
    private validationService: ValidationService,
    private store: Store<{ currentUser }>,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<UserProfileComponent>
  ) {
    this.store
      .pipe(
        select(selectCurrentUser),
        takeUntil(this.destroyStream$)
      )
      .subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.fetchProfile();
    this.avatar = this.user.avatar
      ? this.user.avatar
      : '../../../assets/images/no-user-image.png';
  }

  ngOnDestroy(): void {
    this.destroyStream$.next();
  }

  fetchProfile(): void {
    this.profile = this.formBuilder.group({
      firstname: [this.user.firstname ? this.user.firstname : this.user.firstName],
      lastname: [this.user.lastname ? this.user.lastname : this.user.lastName],
      patronymic: [this.user.patronymic],
      login: [this.user.login],
      dateOfBirth: [this.user.dateOfBirth, [Validators.required]],
      email: [this.user.email, [Validators.pattern(this.validationService.emailRegExp)]],
      phone: [this.user.phone, [Validators.pattern(this.validationService.phoneRegExp)]],
      oldPass: ['', [Validators.pattern(this.validationService.passwordRegExp)]],
      newPass: ['', [Validators.pattern(this.validationService.passwordRegExp)]],
      confirmPass: ['', [Validators.pattern(this.validationService.passwordRegExp)]]
    }, { validator: this.checkPasswords });
  }

  checkPasswords(group: FormGroup): null | object {
    const newPass = group.controls.newPass.value;
    const confirmPass = group.controls.confirmPass.value;
    return newPass === confirmPass ? null : { notSame: true };
  }

  changeAvatar(event): void {
    this.userProfile.readImage(event.target);
    this.avatar$ = this.userProfile.subject
      .pipe(take(1))
      .subscribe(data => {
        this.avatar = data;
        this.fileToUpload = data;
      });
  }

  onSubmit(): void {
    const profile = this.profile.value;
    profile.avatar = this.fileToUpload ? this.fileToUpload : this.user.avatar;
    profile.dateOfBirth = format(new Date(profile.dateOfBirth), 'YYYY-MM-DD');
    this.userProfile.editProfile(profile);
    this.dialogRef.close();
  }
}
