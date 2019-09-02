import { Component, OnInit } from "@angular/core";
import { FormPattern } from "../../../form-data/create-student";
import { StudentsService } from "../../../services/students.service";

@Component({
  selector: "webui-create-student",
  templateUrl: "./create-student.component.html",
  styleUrls: ["./create-student.component.scss"],
  providers: []
})
export class CreateStudentComponent implements OnInit {
  data = FormPattern;
  constructor(private studentsService: StudentsService) {}
  receiveMessage($event) {
    let data = {
      classId: 17,
      login: "",
      oldPass: "",
      newPass: "",
      id: 0
    };
    data = { ...data, ...$event };
    this.studentsService.createStudent(data);
    console.log(data);
  }

  ngOnInit() {}
}