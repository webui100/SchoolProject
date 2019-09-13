import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'webui-new-year-controll',
  templateUrl: './new-year-controll.component.html',
  styleUrls: ['./new-year-controll.component.scss']
})
export class NewYearControllComponent implements OnInit, OnChanges {



  @Input() classesYears: Array<number>;
  @Input() currentYear: number;

  @Output() emitYear: EventEmitter<number> = new EventEmitter();
  @Output() emitWithStudents: EventEmitter<boolean> = new EventEmitter();

  public sortedClassesYear: Array<number> = [];

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    this.sortedClassesYear = [...changes.classesYears.currentValue].sort((year1, year2) => {
      return year1 - year2;
    })
  }

  setYear(year: number) {
    this.emitYear.emit(year);
  }

  changeOnlyWithStudents(isChecked: boolean) {
    this.emitWithStudents.emit(isChecked);
  }

}
