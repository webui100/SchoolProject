import { TransitionService } from 'src/app/services/transition.service';
import {
  selectTransferClasses, selectTransferStudents,
  selectTransferedClasses
} from './../../store/newyear/newyear.selector';
import { ClassesService } from './../../services/classes.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store'
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

  constructor(private classService: ClassesService, private store: Store<{ classes }>,
    private transitionService: TransitionService) { }


  public transferList$: Observable<Array<object>>;
  public studentsList$: Observable<object>;
  // classes that can be transfered
  public transferClasses;
  // students from classes that can be transfered
  public transferStudents;
  private transferListRef: Subscription;
  private studentsListRef: Subscription;
  // already transfered classes
  public transferedClasses$: Observable<Array<ClassModel>>;
  displayedColumns: string[] = ['select', 'name', 'number', 'button', 'newClassName'];
  public selection = new SelectionModel<ClassModel>(true, []);
  public expandedElement = 'conversation';

  ngOnInit() {
    this.classService.getClasses();

    this.transferList$ = this.store.pipe(select(selectTransferClasses));
    this.studentsList$ = this.store.pipe(select(selectTransferStudents));
    this.transferedClasses$ = this.store.pipe(select(selectTransferedClasses));

    this.transferListRef = this.transferList$.subscribe((list: Array<ClassModel>) => {
      this.transferClasses = list;
      if (list.length !== 0) {
        this.transitionService.getStudents(list);
      }
    })

    this.studentsListRef = this.studentsList$.subscribe((value) => {
      this.transferStudents = value
    });

  }

  ngOnDestroy(): void {
    this.transferListRef.unsubscribe();
    this.studentsListRef.unsubscribe();
  }




  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.transferClasses.length;
    return numSelected === numRows;
  }

  generateClassName(className): string {
    return this.transitionService.genereteNewClassName(className);
  }

  transferClassesFunc(classArray: Array<ClassModel>) {
    this.transitionService.transferStudents(classArray);
  }

  transferSelectdClasses() {
    this.transitionService.transferStudents(this.selection.selected);
  }

  transferAllClasses() {
    this.transitionService.transferStudents(this.transferClasses);
  }

}
