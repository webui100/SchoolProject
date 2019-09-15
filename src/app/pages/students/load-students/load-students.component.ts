import { Component, OnInit } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { selectData } from "../../../store/classes/classes.selector";
import { ClassesService } from "../../../services/classes.service";
import { MatRadioChange } from "@angular/material/radio";
import { filter } from "rxjs/operators";
@Component({
  selector: "webui-load-students",
  templateUrl: "./load-students.component.html",
  styleUrls: ["./load-students.component.scss"]
})
export class LoadStudentsComponent implements OnInit {
  constructor(
    private classesService: ClassesService,
    private store: Store<{}>
  ) {}
  private classesData;
  private classList;
  onChange(classGroup: MatRadioChange) {
    classGroup.value == "active"
      ? this.selectActiveClasses()
      : this.selectNonActiveClasses();
  }
  selectActiveClasses() {
    this.classesData = this.store.pipe(select(selectData));
  }
  selectNonActiveClasses() {
    this.classesData = this.store.pipe(select(selectData));
  }
  ngOnInit() {
    this.selectActiveClasses();
  }
}
