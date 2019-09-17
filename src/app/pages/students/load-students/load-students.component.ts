import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { selectClassesData } from "../../../store/students/students.selector";
import { ClassesService } from "../../../services/classes.service";
import { MatRadioChange } from "@angular/material/radio";
import { filter } from "rxjs/operators";

@Component({
  selector: "webui-load-students",
  templateUrl: "./load-students.component.html",
  styleUrls: ["./load-students.component.scss"]
})
export class LoadStudentsComponent implements OnInit {
  private classesData;
  @Output() selectClassEvent = new EventEmitter();
  constructor(
    private classesService: ClassesService,
    private store: Store<{}>
  ) {}
  private loadClasses() {
    if (!this.classesData) {
      this.classesService.getClasses();
    }
    this.store.pipe(select(selectClassesData)).subscribe(data => {
      this.classesData = data.classesList;
    });
  }
  onClassSelect(e) {
    console.log(e) 
    this.selectClassEvent.emit(e);
    
  }

  private onChange(classGroup: MatRadioChange) {
    // this.classesData =
    //   classGroup.value == "active"
    //     ?
  }

  ngOnInit() {
    this.loadClasses();
  }
}
