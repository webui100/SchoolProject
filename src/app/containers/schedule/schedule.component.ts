import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ScheduleService } from 'src/app/services/schedule.service';
import { Store, select } from '@ngrx/store';
import { SubjectsService } from 'src/app/services/subjects.service';
import { tap, startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import initialSchedule from './initial-schedule';
import { selectAll as selectAllSubjects} from 'src/app/store/subjects/subjects.selector';

@Component({
  selector: 'webui-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  daysOfWeek = initialSchedule;
  data = [1, 2, 3, 4];
  dataSourse;
  dataHeaders: string[] = ['col'];
  lessons: string[] = ['math', 'english'];

  term = new FormControl();
  chosenClass = new FormControl();
  year = new FormControl();
  subjects: any[];
  subjectsTemp$: any;
  terms: string[] = ['1', '2'];
  classes: string[] = ['1-А', '2-Б', '3-В'];
  years: number[] = [];
  currentYear = (new Date()).getFullYear();
  filteredTerm: Observable<string[]>;
  filteredClasses: Observable<string[]>;
  filteredYears: Observable<string[]>;

  constructor(private schedule: ScheduleService,
              private subjectsObj: SubjectsService,
              private storeSubjects: Store<{ subjects }>) {
    this.subjectsTemp$ = this.storeSubjects.pipe(select(selectAllSubjects));
  }

  ngOnInit() {
    this.subjectsObj.getSubjects();
    this.subjectsTemp$.subscribe(res => this.subjects = res);

    this.dataSourse = new MatTableDataSource(this.data);
    // this.schedule.getSchedule(16);
    if (!this.years.length) {
      for (let i = -5; i <= 5; i++) {
        this.years.push((this.currentYear + i));
      }
    }

    this.filteredTerm = this.term.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value, this.terms))
      );
    this.filteredClasses = this.chosenClass.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value, this.classes))
      );
    this.filteredYears = this.year.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value.toString(), this.years))
      );
  }

  // displayFn(user?: string): string | undefined {
  //   return user ? user : undefined;
  // }

  private _filter(value: string, arr: any[]): string[] {
    const filterValue = value.toLowerCase();
    if (typeof (arr[0]) === 'number') {
      arr.map((item, index) => arr[index] = item.toString());
    }
    return arr.filter(option => option.toLowerCase().includes(filterValue));
  }

  onSubmit() {
    console.log(parseInt(this.year.value));
  }
}
