import { FormControl } from "@angular/forms";
import { isValid, parseISO } from "date-fns";

export function dateString(control: FormControl) {
  const dateString = control.value;

  const date = toISODate(dateString);

  if (date === null) {
    return { dateString: true };
  }

  return null;
}

function toISODate(date: string) {
  const parts = date.split('/');

  if (parts.length !== 3) {
    return null;
  }

  const isoDateString = `${parts[2]}-${parts[1]}-${parts[0]}`;

  const isoDate = parseISO(isoDateString);

  if (isValid(isoDate)) {
    return isoDate;
  }

  return null;
}
