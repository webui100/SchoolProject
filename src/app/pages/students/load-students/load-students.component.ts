import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { selectClassesData } from '../../../store/students/students.selector';
import { ClassesService } from '../../../services/classes.service';
import { MatRadioChange } from '@angular/material/radio';
import { takeUntil, map, startWith } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'webui-load-students',
  templateUrl: './load-students.component.html',
  styleUrls: ['./load-students.component.scss']
})
export class LoadStudentsComponent implements OnInit {
  private classesData;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private myControl = new FormControl();
  private filteredOptions: Observable<string[]>;
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
          this.classesData = this.classesData.sort(
            (a, b) => parseInt(a.className, 10) - parseInt(b.className, 10)
          );
          this.selectClassGroup(true);
        }
      });
  }
  private onChange(classGroup: MatRadioChange) {
    classGroup.value == 'active'
      ? this.selectClassGroup(true)
      : this.selectClassGroup(false);
  }
  private selectClassGroup(isActive: boolean) {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, isActive))
    );
  }

  private onClassSelect(e) {
    this.selectClassEvent.emit(e);
  }
  ngOnInit() {
    this.loadClasses();
  }
  private _filter(value: string, isActive: boolean): string[] {
    const filterValue = value.toLowerCase();
    if (isActive) {
      return this.classesData.filter(
        option =>
          option.className.toLowerCase().includes(filterValue) &&
          option.isActive
      );
    } else {
      return this.classesData.filter(
        option =>
          option.className.toLowerCase().includes(filterValue) &&
          !option.isActive
      );
    }
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
