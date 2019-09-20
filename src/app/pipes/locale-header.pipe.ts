import { Pipe, PipeTransform } from '@angular/core';
import { dictionaryHeader } from 'src/app/utilities/localeHeaderList';

@Pipe({
  name: 'localeHeader'
})
export class LocaleHeaderPipe implements PipeTransform {
  transform(header: string): string {
    for (const key in dictionaryHeader) {
      if (key === header) {
        return dictionaryHeader[key];
      }
    }
  }
}
