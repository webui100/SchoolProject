import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'journalDateFormat'
})
export class JournalDateFormatPipe implements PipeTransform {

  transform(value: string): string {
    const year = value.substr(0, 4);
    const month = value.substr(5,2);
    const day = value.substr(8,2);
    let monthRoman;
    switch(month) {
      case '01': monthRoman = 'I';
      break;
      case '02': monthRoman = 'II';
      break;
      case '03': monthRoman = 'III';
      break;
      case '04': monthRoman = 'IV';
      break;
      case '05': monthRoman = 'V';
      break;
      case '06': monthRoman = 'VI';
      break;
      case '07': monthRoman = 'VII';
      break;
      case '08': monthRoman = 'VIII';
      break;
      case '09': monthRoman = 'IX';
      break;
      case '10': monthRoman = 'X';
      break;
      case '11': monthRoman = 'XI';
      break;
      case '12': monthRoman = 'XII';
      break;
    }
    return `${year} ${monthRoman}.${day}`;
  }

}
