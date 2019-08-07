import { TeachersService } from '../../../services/teachers.service';
import { Teacher } from '../../../models/teacher';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ValidationService } from 'src/app/services/validation.service';

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
  @Input() teacher: Teacher;

  private fileToUpload: string | ArrayBuffer;
  private avatarImg: string | ArrayBuffer;
  private maxAge = this.teachServise.checkAgeDate();

  constructor(private teachServise: TeachersService,
              private validServ: ValidationService) {}

  editTeacher: FormGroup = new FormGroup({
    firstname: new FormControl('', [Validators.required, Validators.pattern(this.validServ.ukrNameRegExp)]),
    lastname: new FormControl('', [Validators.required, Validators.pattern(this.validServ.ukrNameRegExp)]),
    patronymic: new FormControl('', [Validators.required, Validators.pattern(this.validServ.ukrNameRegExp)]),
    dateOfBirth: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.pattern(this.validServ.emailRegExp)]),
    phone: new FormControl('', [Validators.pattern(this.validServ.phoneRegExp)]),
    login: new FormControl('', [Validators.required, Validators.pattern(this.validServ.loginRegExp)])
  });

  handleFileInput(event) {
    this.teachServise.readFileImage(event.target);
    this.teachServise.subject.subscribe(response => {
      this.avatarImg = response;
      this.fileToUpload = response;
    });
  }

  setDefaultValue(): void {
    this.editTeacher.setValue({
      firstname: this.teacher.firstname,
      lastname: this.teacher.lastname,
      patronymic: this.teacher.patronymic,
      dateOfBirth: this.teacher.dateOfBirth,
      email: this.teacher.email,
      phone: this.teacher.phone,
      login: this.teacher.login
    });
    this.avatarImg = this.teacher.avatar
      ? this.teacher.avatar
      : '../../../assets/images/no-user-image.png';
  }

  submitEdit($event): void {
    $event.preventDefault();
    const data = {
      avatar: this.fileToUpload ? this.fileToUpload : this.teacher.avatar,
      firstname: this.editTeacher.get('firstname').value,
      lastname: this.editTeacher.get('lastname').value,
      patronymic: this.editTeacher.get('patronymic').value,
      dateOfBirth: new Date(this.editTeacher.get('dateOfBirth').value).toISOString().slice(0, 10),
      email: this.editTeacher.get('email').value,
      phone: this.editTeacher.get('phone').value,
      login: this.editTeacher.get('login').value,
      oldPass: '',
      newPass: '',
      id: this.teacher.id
    };
    this.teachServise.editTeacher(this.teacher.id, data);
  }

  ngOnInit() {
   this.setDefaultValue();
  }


}
