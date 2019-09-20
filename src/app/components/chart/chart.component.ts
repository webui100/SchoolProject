
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Chart} from '../../models/chart.model';

@Component({
  selector: 'webui-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  @Input() chartObj: Chart;
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

}