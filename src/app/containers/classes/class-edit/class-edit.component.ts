import { Component, OnInit, Input} from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ClassesService } from "../../../services/classes.service";
import { ValidationService } from "../../../services/validation.service";

@Component({
  selector: "webui-class-edit",
  templateUrl: "./class-edit.component.html",
  styleUrls: ["./class-edit.component.scss"]
})
export class ClassEditComponent implements OnInit {
  @Input() class: any;
  private editClass: FormGroup;
  constructor(
    private classesService: ClassesService,
    private ValidationService: ValidationService,
  ) {}

  onSubmit() {
    let editClassData = this.editClass.value;
    this.classesService.editClass(this.class.id, editClassData)
   }
  ngOnInit() {
    this.editClass = new FormGroup({
      className: new FormControl(this.class.className, [
        Validators.required,
        Validators.pattern(this.ValidationService.classNameRegExp)
      ]),
      classYear: new FormControl(this.class.classYear, [
        Validators.required,
        Validators.pattern(this.ValidationService.classYearRegExp),
        Validators.min(2000)
      ]),
      isActive: new FormControl(`${this.class.isActive}`, Validators.required),
      classDescription: new FormControl(this.class.classDescription)
    });
  }
}
