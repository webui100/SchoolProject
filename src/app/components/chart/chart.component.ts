import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
import { Chart } from '../../models/chart.model';
import { changeOnlyWithStudents } from 'src/app/store/newyear/newyear.actions';

@Component({
  selector: 'webui-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnChanges {

  @Input() chartObj: Chart;
  @Input() year: number;
  @Input() type: string;
  @Output() emitChartType: EventEmitter<string> = new EventEmitter();
  @Output() emitChartClass: EventEmitter<number> = new EventEmitter();

  listOfClasses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  constructor() { }

  setChartType(value: string) {
    this.emitChartType.emit(value);
  }

  setChartClass(value: number) {
    this.emitChartClass.emit(value);
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    //console.log(changes.chartObj.currentValue);
  }

}
