import { Component, OnInit } from '@angular/core';
import { MarkControllerService } from 'src/app/services/mark-controller.service';
import { IMarkType } from 'src/app/models/mark-type.model';
import { Store, select } from '@ngrx/store';
import { selectMarks } from 'src/app/store/marks/marks.selector';
import { Observable } from 'rxjs';

@Component({
  selector: 'webui-mark-controller',
  templateUrl: './mark-controller.component.html',
  styleUrls: ['./mark-controller.component.scss']
})
export class MarkControllerComponent implements OnInit {
  public getMarksList$: Observable<IMarkType[]>;

  constructor(private markServ: MarkControllerService,
              private store: Store<object>) { }
  getMarks() {
    this.markServ.getMarks();
  }

  ngOnInit() {
    this.getMarksList$ = this.store.pipe(select(selectMarks));
  }

}
