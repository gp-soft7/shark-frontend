import { AbstractControl, ValidatorFn } from '@angular/forms';

export function complete(validators: any): ValidatorFn {
  return (control: AbstractControl) => {
    const value = control.value;

    if (Array.isArray(validators)) {
      for (let i = 0; i < validators.length; i++) {
        const validator = validators[i];
        const validationResult = validator(value[i]);

        if (validationResult !== null) return validationResult;
      }
    } else {
      if (value === null) return { required: true };
      for (let i = 0; i < value.length; i++) {
        const validationResult = validators({ value: value[i] });

        if (validationResult !== null) return validationResult;
      }
    }

    return null;
  };
}
