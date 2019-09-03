import { Component, OnInit, OnDestroy } from '@angular/core';
import { selectClassesList } from 'src/app/store/classes/classes.selector';
import { Store, select } from '@ngrx/store';
import { ClassesService } from '../../services/classes.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'webui-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class ClassesComponent implements OnInit, OnDestroy {
  private classes$: any;
  private classesSubscription: Subscription;
  public expandedElement: ClassTable | null;

  constructor(
    private classesService: ClassesService,
    private store: Store<{}>,
  ) {
    this.classes$ = this.store.pipe(select(selectClassesList));
  }

  displayedColumns: string[] = [
    'className',
    'classYear',
    'numOfStudents'
  ];

  private classTableHead (columnName){
    switch(columnName){
      case 'className': return 'Клас';
      case 'classYear': return 'Рік';
      case 'numOfStudents': return 'Кількість учнів';
    }

  }

  activeUniqueClassList: Map<string, Array<Object>>;
  nonActiveUniqueClassList: Map<string, Array<Object>>;

  // Sorting logic
  isNumber(value) {
    return Number.isInteger(value);
  }
  getClassinScopes(clasName) {
    return Number(clasName.match(/\((.*)\)/)[1]);
  }
  // Sorting Accordions of Classes.
  // At first sort "main" classes "1-11"
  sortKeys = (current, previous) => {
    const parsedCurrent = Number(current.key);
    const parsedPrevious = Number(previous.key);

    if (this.isNumber(parsedCurrent) && this.isNumber(parsedPrevious)) {
      return parsedCurrent - parsedPrevious;
    }
    else if (this.isNumber(parsedCurrent) && !this.isNumber(parsedPrevious) && parsedCurrent != 0) {
      return -1;
    }
    // Sorting custom classes "4(8)  at first by custom class.( in scopes "(8)").
    // Then by main (class before scopes).
    else if (current.key.includes("(") && previous.key.includes("(")) {
      const currentCustomClass = this.getClassinScopes(current.key);
      const previousCustomClass = Number(previous.key.match(/\((.*)\)/)[1]);
      const currentMainClass = parseInt(current.key);
      const previousMainClass = parseInt(previous.key);
      if (currentCustomClass == previousCustomClass && currentMainClass < previousMainClass) {
        return currentMainClass - previousMainClass;
      }
      else {
        return currentCustomClass - previousCustomClass;
      }
    } else {
      return 1;
    }
  }

  ngOnInit() {
    this.classesSubscription = this.classes$.subscribe(classesList => {
      this.activeUniqueClassList = classesList.activeUniqueClassList;
      this.nonActiveUniqueClassList = classesList.nonActiveUniqueClassList;
    })
    // get data from endpoint
    this.classesService.getClasses();
    
  }
  ngOnDestroy(): void {
    this.classesSubscription.unsubscribe();
  }
}

export interface ClassTable {
  className: string;
  classYear: number;
  numOfStudents: number;
  id: number;
  classDescription: string;
  isActive: boolean;
}




