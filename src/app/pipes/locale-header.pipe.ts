import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localeHeader'
})
export class LocaleHeaderPipe implements PipeTransform {
  transform(value: string): any {
    switch (value) {
      case 'firstname':
        return 'Ім\'я';
      case 'patronymic':
        return 'По-батькові';
      case 'lastname':
        return 'Прізвище';
    }
  }

}
