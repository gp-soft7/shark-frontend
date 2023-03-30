export type InputTypes =
  | 'text'
  | 'text-resizable'
  | 'password'
  | 'number'
  | 'number-resizable'
  | 'phone'
  | 'currency'
  | 'currency-resizable'
  | 'date-string'
  | 'checkbox'
  | 'cpf';

export const InputErrorMessages = {
  required: 'Campo obrigatório',
  min: 'No mínimo {}',
  max: 'No máximo {}',
  number: 'Número inválido',
  invalidAccessToken: 'Código de acesso inválido',
  email: 'Email inválido',
  minlength: 'No mínimo {} caracteres',
  invalidPasswordConfirmation: 'As senhas não são iguais',
  dateString: 'Data inválida',
  cpf: "CPF inválido",
  phone: "Telefone inválido"
};
