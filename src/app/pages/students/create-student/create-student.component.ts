import { Component, OnInit, Input } from '@angular/core';
import { FormPattern } from '../../../form-data/create-student';
import { StudentsService } from '../../../services/students.service';

@Component({
  selector: 'webui-create-student',
  templateUrl: './create-student.component.html',
  styleUrls: ['./create-student.component.scss'],
  providers: []
})
export class CreateStudentComponent implements OnInit {
  private data = FormPattern;
  @Input() idOfClass;

  constructor(private studentsService: StudentsService) {}
  receiveMessage($event) {
    let data = {
      classId: this.idOfClass,
      login: '',
      oldPass: '',
      newPass: '',
      id: 0
    };
    data = { ...data, ...$event };
    this.studentsService.createStudent(data);
  }

  ngOnInit() {}
}
