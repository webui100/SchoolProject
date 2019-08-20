import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';


@Component({
  selector: 'webui-sort-button',
  templateUrl: './sort-button.component.html',
  styleUrls: ['./sort-button.component.scss']
})
export class SortButtonComponent implements OnInit {
  @Input() columnName: string;
  @Output() sortOptions = new EventEmitter();

  private nextDirection: string;
  private ascending = true;

  constructor( ) { }

  ngOnInit() {
  }

  sortSetting(e): void {
    const currentDirection = e.target.getAttribute('data-nextDirection');
    this.nextDirection = currentDirection === 'desc' ? 'asc' : 'desc';
    this.ascending = !this.ascending;
    this.sortOptions.emit({
        direction: currentDirection,
        column: this.columnName
      });
  }

}
