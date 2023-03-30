export type GetUserProfileResponse = {
  birthDate: string;
  cellphone: string;
  cpf: string;
  createdAt: string;
  email: string;
  firstName: string;
  id: string;
  lastLoginAt: string;
  lastName: string;
};

export type GetUserSubscriptionResponse = {
  status: string;
  createdAt: Date;
  updatedAt: Date;
};
