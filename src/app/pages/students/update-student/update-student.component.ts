import { Component, OnInit, Input } from "@angular/core";
import { StudentsService } from "../../../services/students.service";
import { Student } from "../../../models/students";
import { FormPattern } from "../../../form-data/update-student";

@Component({
  selector: "webui-update-student",
  templateUrl: "./update-student.component.html",
  styleUrls: ["./update-student.component.scss"]
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

  ngOnInit() {
    console.log("say hi");
  }
}
