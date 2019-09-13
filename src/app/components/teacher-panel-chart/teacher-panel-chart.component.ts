import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'webui-teacher-chart',
  templateUrl: './teacher-panel-chart.component.html',
  styleUrls: ['./teacher-panel-chart.component.scss']
})
export class TeacherChartComponent implements OnInit {

  constructor() { }
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels = ['Прізвище, ім\'я' , 'Прізвище, ім\'я', 'Прізвище, ім\'я', 'Прізвище, ім\'я', 'Прізвище, ім\'я', 'Прізвище, ім\'я', 'Прізвище, ім\'я'];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData = [
    {data: [12, 10, 8, 8, 5, 6, 8], label: 'Клас 11-А'},
  ];
  ngOnInit() {
  }
}

