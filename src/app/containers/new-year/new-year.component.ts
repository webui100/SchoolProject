import { selectTransferClasses } from './../../store/newyear/newyear.selector';
import { ClassesService } from './../../services/classes.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {Store, select} from '@ngrx/store'
import { SelectionModel } from '@angular/cdk/collections';
import ClassModel from 'src/app/models/schoolclass.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'webui-new-year',
  templateUrl: './new-year.component.html',
  styleUrls: ['./new-year.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class NewYearComponent implements OnInit, OnDestroy {

  constructor(private classService: ClassesService, private store: Store<{classes}>) { }

  public transferList$: Observable<Array<object>>;
  private transferClasses;
  private transferListRef: Subscription;

  ngOnInit() {
    this.classService.getClasses();

    this.transferList$ = this.store.pipe(select(selectTransferClasses));

    this.selection = new SelectionModel<ClassModel>(true, []);

    this.transferListRef = this.transferList$.subscribe((value) => {
      this.transferClasses = value;
    })
  }

  ngOnDestroy(): void {
    this.transferListRef.unsubscribe();
  }

  displayedColumns: string[] = ['select', 'name', 'number', 'year'];

  public selection;
  public expandedElement = 'conversation';


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.transferClasses.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.transferClasses.forEach(row => this.selection.select(row));
    console.log(this.selection);
  }

}
