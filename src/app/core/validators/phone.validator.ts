import { FormControl } from "@angular/forms";

export function phone(control: FormControl) {
  const value = control.value;

  const isValid = /^(\(?\d{2}\)?\s)?(\d{4,5}\-\d{4,5})$/.test(value);

  if (!isValid) {
    return { phone: true };
  }

  return null;
}
