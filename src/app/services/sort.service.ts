import { Injectable } from '@angular/core';
import { State as AppState } from 'src/app/store/index';
import { SortOptions } from '../models/sortOptions.model';

@Injectable({
  providedIn: 'root'
})
export class SortService {

  constructor() { }

  sortColumn(state: AppState[], options: SortOptions) {
    if (state !== null || undefined) {
    const filtered = state.filter(el => el !== undefined);
    filtered.sort(
      (a: any, b: any): number => {
          return a[options.column].localeCompare(b[options.column]);
      }
    );
    if (options.direction === 'desc') {
      filtered.reverse();
    }
    return filtered;
  }
}
}
