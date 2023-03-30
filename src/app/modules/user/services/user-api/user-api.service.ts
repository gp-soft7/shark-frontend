import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { apiUrl } from '../../../../shared/helpers/functions/api-url.helper';
import {
  GetUserProfileResponse,
  GetUserSubscriptionResponse,
} from './user-api.service.types';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  constructor(private httpClient: HttpClient) {}

  async getUserProfile() {
    return await firstValueFrom(
      this.httpClient.get<GetUserProfileResponse>(apiUrl('user/profile'))
    );
  }

  async getUserSubscription() {
    return await firstValueFrom(
      this.httpClient.get<GetUserSubscriptionResponse>(
        apiUrl('user/subscription')
      )
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
}
