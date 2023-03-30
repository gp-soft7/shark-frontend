import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { apiUrl } from '../../../../shared/helpers/functions/api-url.helper';
import { GetUserProfileResponse } from './user-api.service.types';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  constructor(private httpClient: HttpClient) {}

  async getUserProfile() {
    return await firstValueFrom(
      this.httpClient.get<GetUserProfileResponse>(apiUrl('user/profile'))
    );
  }

  async completeSignUp(data: any) {
    return await firstValueFrom(
      this.httpClient.post(apiUrl('user/complete'), data)
    );
  }

  async getUserProfileByEmail(email: string) {
    return await firstValueFrom(
      this.httpClient.get<GetUserProfileResponse>(
        apiUrl(`user/profile/${email}`)
      )
    );
  }

  async vinculatePlatform(platform: string, nickname: string) {
    return await firstValueFrom(
      this.httpClient.post(apiUrl('user/vinculation'), { platform, nickname })
    );
  }
}
