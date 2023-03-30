import { complete } from './complete.validator';
import { number } from './number.validator';
import { cpf } from './cpf.validator';
import { dateString } from './date-string.validator';
import { phone } from './phone.validator';

export const AppValidators = {
  number,
  complete,
  cpf,
  dateString,
  phone
};
