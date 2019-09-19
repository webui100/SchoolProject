import { Component, OnInit, OnDestroy } from '@angular/core';
import { selectClassesAll } from 'src/app/store/classes/classes.selector';
import { Store, select } from '@ngrx/store';
import { ClassesService } from '../../services/classes.service';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'webui-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      )
    ])
  ]
})
export class ClassesComponent implements OnInit, OnDestroy {
  private classes$: any;
  private classesSubscription: Subscription;
  public expandedElement: ClassTable | null;
  private sortKeys: Function;

  constructor(
    private classesService: ClassesService,
    private store: Store<{}>
  ) {
    this.classes$ = this.store.pipe(select(selectClassesAll));
    this.sortKeys = this.classesService.sortClasses();
  }

  displayedColumns: string[] = ['className', 'classYear', 'numOfStudents'];

  activeUniqueClassList: Map<string, Array<Object>>;
  nonActiveUniqueClassList: Map<string, Array<Object>>;

  ngOnInit() {
    this.classesSubscription = this.classes$.subscribe(classesList => {
      this.activeUniqueClassList = classesList.activeUniqueClassList;
      this.nonActiveUniqueClassList = classesList.nonActiveUniqueClassList;
    });
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
