import {Component, Input, OnInit} from '@angular/core';
import {QtObj} from '../../models/quantityObj.model';

@Component({
  selector: 'webui-count-bar',
  templateUrl: './count-bar.component.html',
  styleUrls: ['./count-bar.component.scss']
})
export class CountBarComponent implements OnInit {

  @Input() quantityObj: QtObj;

  constructor() { }

  ngOnInit() {

  }

}
