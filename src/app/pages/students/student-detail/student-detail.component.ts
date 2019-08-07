import { Component, OnInit, Input } from "@angular/core";
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { StudentsService } from "../../../services/students.service";
import { Student } from "../../../models/students";
import { ValidationService } from "../../../services/validation.service";
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter
} from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from "@angular/material/core";
@Component({
  selector: "webui-student-detail",
  templateUrl: "./student-detail.component.html",
  styleUrls: ["./student-detail.component.scss"],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "uk-UK" },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ]
})
export class StudentDetailComponent implements OnInit {
  @Input() student: Student;
  selectedFile;
  studentAvatar;

  constructor(
    private studentsService: StudentsService,
    private formValidation: ValidationService
  ) {}

  updateStudent: FormGroup = new FormGroup({
    dateOfBirth: new FormControl("", Validators.required),
    login: new FormControl("", [
      Validators.required,
      Validators.pattern(this.formValidation.loginRegExp)
    ]),
    firstname: new FormControl("", [
      Validators.required,
      Validators.pattern(this.formValidation.ukrNameRegExp)
    ]),
    lastname: new FormControl("", [
      Validators.required,
      Validators.pattern(this.formValidation.ukrNameRegExp)
    ]),
    patronymic: new FormControl("", [
      Validators.required,
      Validators.pattern(this.formValidation.ukrNameRegExp)
    ]),
    email: new FormControl("", [
      Validators.pattern(this.formValidation.emailRegExp)
    ]),
    phone: new FormControl("", [
      Validators.pattern(this.formValidation.phoneRegExp)
    ])
  });
  //Event hendler for encrypt img to BASE64
  onFileSelected(event) {
    this.studentsService.encImage(event);
    this.studentsService.observable.subscribe(res => {
      this.selectedFile = res;
      this.studentAvatar = res;
    });
  }
  // Event hendler for editing student
  onSumbit($event) {
    $event.preventDefault();
    const data = {
      firstname: this.updateStudent.get("firstname").value,
      avatar: this.selectedFile ? this.selectedFile : this.student.avatar,
      dateOfBirth: this.studentsService.generateDate(
        this.updateStudent,
        "dateOfBirth"
      ),
      login: this.updateStudent.get("login").value,
      oldPass: "",
      newPass: "",
      lastname: this.updateStudent.get("lastname").value,
      patronymic: this.updateStudent.get("patronymic").value,
      email: this.updateStudent.get("email").value,
      phone: this.updateStudent.get("phone").value,
      id: this.student.id
    };

    this.studentsService.updateStudentData(data);
  }
  setValue() {
    this.updateStudent.patchValue({
      dateOfBirth: this.student.dateOfBirth,
      login: this.student.login,
      firstname: this.student.firstname,
      lastname: this.student.lastname,
      patronymic: this.student.patronymic,
      email: this.student.email,
      phone: this.student.phone
    });
    this.studentAvatar = this.student.avatar
      ? this.student.avatar
      : "../../../../assets/images/no-user-image.png";
  }

  ngOnInit() {
    this.setValue();
  }
}
