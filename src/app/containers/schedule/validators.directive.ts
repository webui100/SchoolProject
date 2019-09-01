import { ValidatorFn, AbstractControl } from '@angular/forms';

export function listValidation(list): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let matched = false;
      if (control.value) {
        for (let item of list) {
          if (control.value === item) {
            matched = true;
          }
        }
      } else {
        matched = true;
      };

      return !matched ? {validity: { value: control.value }} : null
    };
}
