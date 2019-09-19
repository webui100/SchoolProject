import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { selectClassesData } from "../../../store/students/students.selector";
import { ClassesService } from "../../../services/classes.service";
import { MatRadioChange } from "@angular/material/radio";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  selector: "webui-load-students",
  templateUrl: "./load-students.component.html",
  styleUrls: ["./load-students.component.scss"]
})
export class LoadStudentsComponent implements OnInit {
  private classesData;
  private classesList: Object[];
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  //Active not active always reasign, need to add new variable for that!!
  @Output() selectClassEvent = new EventEmitter();
  constructor(
    private classesService: ClassesService,
    private store: Store<{}>
  ) {}
  private loadClasses() {
    this.classesService.getClasses();
    this.store
      .pipe(
        select(selectClassesData),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(data => {
        this.classesData = data.classesList;
        if (this.classesData) {
          this.selectClassGroup(true);
        }
      });
  }
  private selectClassGroup(isActive: boolean) {
    if (isActive) {
      this.classesList = this.classesData.filter(
        data => data.isActive === true
      );
    } else {
      this.classesList = this.classesData.filter(
        data => data.isActive === false
      );
    }
  }

  private onClassSelect(e) {
    this.selectClassEvent.emit(e);
  }

  private onChange(classGroup: MatRadioChange) {
    classGroup.value == "active"
      ? this.selectClassGroup(true)
      : this.selectClassGroup(false);
  }

  ngOnInit() {
    this.loadClasses();
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
