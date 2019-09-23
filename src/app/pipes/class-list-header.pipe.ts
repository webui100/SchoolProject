import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'classListHeader'
})
export class ClassListHeaderPipe implements PipeTransform {

  transform(value: string): string {
    switch(value){
      case 'className': return 'Клас';
      case 'classYear': return 'Рік';
      case 'numOfStudents': return 'Кількість учнів';
    }
  }

}
