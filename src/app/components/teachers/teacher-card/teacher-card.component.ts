import { format, addYears } from 'date-fns';
import { Subscription, Subject } from 'rxjs';
import { NotificationService } from '../../../services/notification.service';
import { TeachersService } from '../../../services/teachers.service';
import { ITeacher } from '../../../models/teacher.model';
import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ValidationService } from '../../../services/validation.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'webui-teacher-card',
  templateUrl: './teacher-card.component.html',
  styleUrls: ['./teacher-card.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'uk-UK'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class TeacherCardComponent implements OnInit {
  @Input() teacher: ITeacher;

  private fileToUpload: string | ArrayBuffer;
  private avatarImg: string | ArrayBuffer;
  private maxAge =  addYears(new Date(), -18); // this.teachServise.checkAgeDate();
  public editTeacher;

  constructor(private teachServise?: TeachersService,
              private validServ?: ValidationService,
              private formBuilder?: FormBuilder,
              private notify?: NotificationService) {
              }

  handleFileInput(event: any): void {
    this.teachServise.readFileImage(event.target);
    this.teachServise.subject
    .pipe(take(1))
    .subscribe(
    response => {
      this.avatarImg = response;
      this.fileToUpload = response;
    },
    error => {
      this.notify.notifyFailure('Не вдалося завантажити фото');
      this.teachServise.subject = new Subject();
      throw new Error(error);
    },
    () => console.log('complete'));
  }

  submitEdit(event: Event): void {
    event.preventDefault();
    const data = this.editTeacher.value;
    data.avatar = this.fileToUpload ? this.fileToUpload : this.teacher.avatar;
    data.dateOfBirth = format(new Date(data.dateOfBirth), 'YYYY-MM-DD');
    data.oldPass = '';
    data.newPass = '';
    data.id = this.teacher.id;
    this.teachServise.editTeacher(data.id, data);
  }

  ngOnInit() {
   this.editTeacher = this.formBuilder.group({
    firstname: [this.teacher.firstname, [Validators.required, Validators.pattern(this.validServ.ukrNameRegExp)]],
    lastname: [this.teacher.lastname, [Validators.required, Validators.pattern(this.validServ.ukrNameRegExp)]],
    patronymic: [this.teacher.patronymic, [Validators.required, Validators.pattern(this.validServ.ukrNameRegExp)]],
    dateOfBirth: [this.teacher.dateOfBirth, Validators.required],
    email: [this.teacher.email, [Validators.pattern(this.validServ.emailRegExp)]],
    phone: [this.teacher.phone, [Validators.pattern(this.validServ.phoneRegExp)]],
    login: [this.teacher.login, [Validators.required, Validators.pattern(this.validServ.loginRegExp)]]
  });
   this.avatarImg = this.teacher.avatar
      ? this.teacher.avatar
      : '../../../assets/images/no-user-image.png';
  }
}
