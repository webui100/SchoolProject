import { TransitionService } from 'src/app/services/transition.service';
import { selectTransferClasses, selectTransferStudents } from './../../store/newyear/newyear.selector';
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

  constructor(private classService: ClassesService, private store: Store<{classes}>,
    private transitionService: TransitionService) { }

  public transferList$: Observable<Array<object>>;
  public studentsList$: Observable<object>;
  public transferClasses;
  public transferStudents;
  private transferListRef: Subscription;
  private studentsListRef: Subscription;

  ngOnInit() {
    this.classService.getClasses();

    this.transferList$ = this.store.pipe(select(selectTransferClasses));
    this.studentsList$ = this.store.pipe(select(selectTransferStudents))

    this.selection = new SelectionModel<ClassModel>(true, []);

    this.transferListRef = this.transferList$.subscribe((value) => {
      this.transferClasses = value;
    })

    this.transferList$.subscribe((list: Array<ClassModel>) => {
      if(list.length !== 0) {
        this.transitionService.getStudents(list);
      }
      
    })

    this.studentsListRef = this.studentsList$.subscribe((value) => {
      this.transferStudents = value});
    
  }

  ngOnDestroy(): void {
    this.transferListRef.unsubscribe();
  }

  displayedColumns: string[] = ['select', 'name', 'number', 'button', 'newClassName'];

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

  generateClassName(className): string {
    return this.transitionService.genereteNewClassName(className);
  }

  transferClassesFunc(classArray: Array<ClassModel>) {
    console.log(classArray)
    this.transitionService.createNewClass(classArray).subscribe(
      value => console.log(value),
      (error) => console.log(error)
    );
  }

}
