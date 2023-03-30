import { format } from 'date-fns';

export function getCurrentBrazilianDateFormattedDate() {
  return format(new Date(), 'dd/MM/yyyy');
}
