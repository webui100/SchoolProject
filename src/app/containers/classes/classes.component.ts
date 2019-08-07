import { Component, OnInit } from '@angular/core';
import { selectClassesList } from 'src/app/store/classes/classes.selector';
import { Store, select } from '@ngrx/store';
import { ClassesService } from '../../services/classes.service';

@Component({
  selector: 'webui-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class ClassesComponent implements OnInit {
  private classes$: any;
  
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

  activeUniqueClassList = new Map();
  nonActiveUniqueClassList = new Map();

  groupByStatus(classList){
    classList.forEach(schoolClass => {
      const uniqueClassName = this.getUniqueClassNames(schoolClass); 
      if(schoolClass.isActive){
        this.activeUniqueClassList.has(uniqueClassName) ?
        this.activeUniqueClassList.get(uniqueClassName).push(schoolClass) :
        this.activeUniqueClassList.set(uniqueClassName,[schoolClass])
      }
      else{
        this.nonActiveUniqueClassList.has(uniqueClassName) ?
        this.nonActiveUniqueClassList.get(uniqueClassName).push(schoolClass) :
        this.nonActiveUniqueClassList.set(uniqueClassName,[schoolClass])
      }
    })
  }

  getUniqueClassNames(schoolClass){
    let indexOfDash = schoolClass['className'].indexOf('-');
    if(schoolClass['className'].includes('(')){
      return schoolClass['className'].substring(0,indexOfDash) + ")"
    }
    else{
      return schoolClass['className'].substring(0,indexOfDash)
    }
  }

  ngOnInit() {
    // get data from endpoint
    this.classesService.getClasses();
    this.classes$.subscribe(classesList =>{
      if(classesList){
        this.groupByStatus(classesList)
      }
    })
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