import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { apiUrl } from '../../../shared/helpers/functions/api-url.helper';
import { RefreshTokenResponse, SignInResponse } from './auth-api.service.types';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  constructor(private httpClient: HttpClient) {}

  async signIn(email: string, password: string) {
    return await firstValueFrom(
      this.httpClient.post<SignInResponse>(apiUrl('auth/signin'), {
        email,
        password,
      })
    );
  }

  async verifyEmail(email: string) {
    return await firstValueFrom(
      this.httpClient.post(apiUrl('auth/verify-email'), {
        email,
      })
    );
  }

  async changePassword(oldPassword: string, newPassword: string) {
    return await firstValueFrom(
      this.httpClient.patch(apiUrl('auth/change-password'), {
        oldPassword,
        newPassword,
      })
    );
  }

  async forgotPassword(email: string) {
    return await firstValueFrom(
      this.httpClient.post(apiUrl('auth/forgot-password'), {
        email,
      })
    );
  }

  async resetPassword(token: string, password: string) {
    return await firstValueFrom(
      this.httpClient.post(apiUrl('auth/reset-password'), {
        token,
        password,
      })
    );
  }

  refreshToken(refreshToken: string, userId: string) {
    return this.httpClient.post<RefreshTokenResponse>(
      apiUrl('auth/refresh-token'),
      {
        refreshToken,
        userId,
      }
    );
  }
}
