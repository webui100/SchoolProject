import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayFilter'
})
export class ArrayFilterPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    const [key, toFilter] = args;
    if (!value || !value.length || !toFilter) { return value; }

    const result = value.filter((item) => item[key] === toFilter);
    // console.log('result', result);
    return result;
  }

}
