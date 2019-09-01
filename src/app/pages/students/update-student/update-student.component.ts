import { Component, OnInit, Input } from "@angular/core";
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { StudentsService } from "../../../services/students.service";
import { Student } from "../../../models/students";
import { ValidationService } from "../../../services/validation.service";
import { FormPattern } from "../../../form-data/update-student";

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
  selector: "webui-update-student",
  templateUrl: "./update-student.component.html",
  styleUrls: ["./update-student.component.scss"],
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
export class UpdateStudentComponent implements OnInit {
  @Input() student: Student;
  data = FormPattern;
  constructor(private studentsService: StudentsService) {}
  receiveMessage($event) {
    let data = {
      oldPass: "",
      newPass: ""
    };
    data = { ...data, ...$event };

    this.studentsService.updateStudentData(data, this.student.id);
  }

  ngOnInit() {}
}
