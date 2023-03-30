import { FormControl } from '@angular/forms';

export function number(control: FormControl) {
  return isNaN(control.value) ? { number: true } : null;
}
