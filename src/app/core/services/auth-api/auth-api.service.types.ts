export type SignInResponse = {
  accessToken: string;
  refreshToken: string;
};

export type RefreshTokenResponse = SignInResponse;
