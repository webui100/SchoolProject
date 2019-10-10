import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';


@Component({
  selector: 'webui-sort-button',
  templateUrl: './sort-button.component.html',
  styleUrls: ['./sort-button.component.scss']
})
export class SortButtonComponent {
  @Input() columnName: string;
  @Output() sortOptions = new EventEmitter();

  private nextDirection: string; // next direction value
  private ascending = true; // default value direction


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
