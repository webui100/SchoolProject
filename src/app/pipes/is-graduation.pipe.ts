import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isGraduation'
})
export class IsGraduationPipe implements PipeTransform {

  transform(className: string): string {
    return className ? className : 'Випускинй клас';
  }

}
