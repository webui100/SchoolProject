import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'newYear'
})
export class NewYearPipe implements PipeTransform {

  transform(year: number): string {
    let nextYear = (year + 1) + '';
    return `${year}/${nextYear.substring(2)}`;
  }

}
