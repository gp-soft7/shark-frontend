import { FormControl } from '@angular/forms';

export function cpf(control: FormControl) {
  const value = control.value.replace(/\D/g, '');

  if (value.toString().length !== 11 || /^(\d)\1{10}$/.test(value))
    return {
      cpf: true,
    };

  let valid = true;

  [9, 10].forEach(function (j) {
    let sum = 0,
      r;
    value
      .split(/(?=)/)
      .splice(0, j)
      .forEach(function (e: any, i: any) {
        sum += parseInt(e) * (j + 2 - (i + 1));
      });
    r = sum % 11;
    r = r < 2 ? 0 : 11 - r;
    if (r != value.substring(j, j + 1)) valid = false;
  });

  if (!valid) {
    return { cpf: true };
  }

  return null;
}
