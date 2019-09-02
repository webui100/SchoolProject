import { TransitionService } from 'src/app/services/transition.service';
import {
  selectTransferClasses, selectTransferStudents,
  selectTransferedClasses, selectClassesYears
} from './../../store/newyear/newyear.selector';
import { ClassesService } from './../../services/classes.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store'
import { SelectionModel } from '@angular/cdk/collections';
import ClassModel from 'src/app/models/schoolclass.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable, Subscription, BehaviorSubject, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import * as NewYearActions from '../../store/newyear/newyear.actions';

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

  public year: number;
  public transferList$: Observable<Array<object>>;
  public studentsList$: Observable<object>;
  // classes that can be transfered
  // ts ignore
  public transferClasses: Array<ClassModel> = [];
  // students from classes that can be transfered
  public transferStudents;
  private transferListRef: Subscription;
  private studentsListRef: Subscription;
  private yearRef: Subscription;
  private isWithStudentsRef: Subscription;
  // already transfered classes
  public transferedClasses$: Observable<Array<ClassModel>>;
  displayedColumns: string[] = ['select', 'name', 'number', 'button', 'newClassName'];
  public selection = new SelectionModel<ClassModel>(true, []);
  public expandedElement = 'conversation';
  public classesYears$: Observable<Set<number>>;
  public yearSubject$: BehaviorSubject<number>;
  public isWithStudentsSubject$: Subject<boolean>;
  public transferClassesData: MatTableDataSource<any>;
  public isLoading = true;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  ngOnInit() {
    this.classService.getClasses();
    this.year = new Date(Date.now()).getFullYear() - 1;
    this.yearSubject$ = new BehaviorSubject(this.year);
    this.isWithStudentsSubject$ = new Subject();

    this.transferList$ = this.store.pipe(select(selectTransferClasses));

    this.studentsList$ = this.store.pipe(select(selectTransferStudents));

    this.transferedClasses$ = this.store.pipe(select(selectTransferedClasses));

    this.classesYears$ = this.store.pipe(select(selectClassesYears));

    this.transferListRef = this.transferList$.subscribe((list: Array<ClassModel>) => {
      if (list.length > 0) {
        let ref = this.transitionService.getStudents(list).subscribe();
        ref.unsubscribe();
      }
      this.transferClasses = list;
      this.transferClassesData = new MatTableDataSource(list);
      this.transferClassesData.paginator = this.paginator;
      this.isLoading = false;
    })

    this.isLoading = true;


    this.yearRef = this.yearSubject$.subscribe((year: number) => {
      this.store.dispatch(NewYearActions.setYear({ year }));
      let ref = this.transitionService.getStudents(this.transferClasses).subscribe();
      ref.unsubscribe();
    })

    this.isWithStudentsRef = this.isWithStudentsSubject$.subscribe((isWithStudents: boolean) => {
      this.store.dispatch(NewYearActions.changeOnlyWithStudents({ isWithStudents }));
    })

    this.studentsListRef = this.studentsList$.subscribe((value) => {
      this.transferStudents = value
    });

  }

  ngOnDestroy(): void {
    this.transferListRef.unsubscribe();
    this.studentsListRef.unsubscribe();
    this.yearRef.unsubscribe();
    this.isWithStudentsRef.unsubscribe();
  }


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.transferClasses.length;
    return numSelected === numRows;
  }

  generateClassName(className): string {
    return this.transitionService.genereteNewClassName(className);
  }

  transferClassesFunc(classArray: Array<ClassModel>, studingYear: number) {
    this.transitionService.transferStudents(classArray, studingYear);
  }

  transferSelectdClasses(studingYear: number) {
    this.transitionService.transferStudents(this.selection.selected, studingYear);
  }

  transferAllClasses(studingYear: number) {
    this.transitionService.transferStudents(this.transferClasses, studingYear);
  }

}
