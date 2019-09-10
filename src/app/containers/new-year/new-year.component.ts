import { TransitionService } from 'src/app/services/transition.service';
import {
  selectTransferClasses, selectTransferStudents,
  selectTransferedClasses, selectClassesYears,
  selectAllTransferStudents
} from './../../store/newyear/newyear.selector';
import { ClassesService } from './../../services/classes.service';
import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store'
import { SelectionModel } from '@angular/cdk/collections';
import ClassModel from 'src/app/models/schoolclass.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable, Subscription, BehaviorSubject, Subject, ReplaySubject } from 'rxjs';
import { switchMap, takeUntil, map } from 'rxjs/operators';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import * as NewYearActions from '../../store/newyear/newyear.actions';
import { Student } from 'src/app/models/profile.model';

@Component({
  selector: 'webui-new-year',
  templateUrl: './new-year.component.html',
  styleUrls: ['./new-year.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  private destroy$: ReplaySubject<boolean> = new ReplaySubject(1);
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

    this.transferList$ = this.store.pipe(
      select(selectTransferClasses),
      takeUntil(this.destroy$));

    this.studentsList$ = this.store.pipe(
      select(selectTransferStudents),
      takeUntil(this.destroy$));

    this.transferedClasses$ = this.store.pipe(
      select(selectTransferedClasses),
      takeUntil(this.destroy$)
    );

    this.classesYears$ = this.store.pipe(
      select(selectClassesYears),
      takeUntil(this.destroy$));

    this.store.pipe(
      select(selectAllTransferStudents),
      takeUntil(this.destroy$)
    ).subscribe((students: []) => {
      this.transitionService.setTransferStudents(students);
    });

    this.transferList$.subscribe((list: Array<ClassModel>) => {
      this.transferClasses = list;
      this.transferClassesData = new MatTableDataSource(list);
      this.transferClassesData.paginator = this.paginator;
      this.isLoading = false;
    })

    this.isLoading = true;


    this.yearSubject$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((year: number) => {
      this.store.dispatch(NewYearActions.setYear({ year }));
      console.log(year);
      this.transitionService.getStudents(this.transferClasses).pipe(
        takeUntil(this.destroy$)
      )
        .subscribe();
    })

    this.isWithStudentsSubject$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((isWithStudents: boolean) => {
      this.store.dispatch(NewYearActions.changeOnlyWithStudents({ isWithStudents }));
    })

    this.studentsList$.subscribe((value) => {
      this.transferStudents = value;
    });

  }

  ngOnDestroy(): void {
    console.log("destroyed");
    this.destroy$.next(true);

    this.destroy$.unsubscribe();

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
