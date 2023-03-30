import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { apiUrl } from '../../../../shared/helpers/functions/api-url.helper';
import {
  GetBriefUserStrategiesResponse,
  GetUserStrategiesResponse,
  GetUserStrategyResponse,
} from './strategy-api.service.types';

@Injectable({ providedIn: 'root' })
export class StrategyApiService {
  constructor(private httpClient: HttpClient) {}

  async createUserStrategy(data: any) {
    return await firstValueFrom(this.httpClient.post(apiUrl('strategy'), data));
  }

  async updateUserStrategy(data: any) {
    return await firstValueFrom(this.httpClient.put(apiUrl('strategy'), data));
  }

  async getUserStrategies() {
    return await firstValueFrom(
      this.httpClient.get<GetUserStrategiesResponse>(apiUrl('strategy'))
    );
  }

  async getUserStrategy(strategyId: string) {
    return await firstValueFrom(
      this.httpClient.get<GetUserStrategyResponse>(
        apiUrl(`strategy/${strategyId}`)
      )
    );
  }

  async getActiveUserStrategies() {
    return await firstValueFrom(
      this.httpClient.get<GetUserStrategiesResponse>(
        apiUrl('strategy/all/active')
      )
    );
  }

  async getBriefActiveUserStrategies() {
    return await firstValueFrom(
      this.httpClient.get<GetBriefUserStrategiesResponse>(
        apiUrl('strategy/brief/active')
      )
    );
  }

  async patchActivateStrategy(strategyId: string) {
    return await firstValueFrom(
      this.httpClient.patch(apiUrl(`strategy/${strategyId}/activate`), {})
    );
  }

  async patchDeactivateStrategy(strategyId: string) {
    return await firstValueFrom(
      this.httpClient.patch(apiUrl(`strategy/${strategyId}/deactivate`), {})
    );
  }

  async deleteUserStrategy(strategyId: string) {
    return await firstValueFrom(
      this.httpClient.delete(apiUrl(`strategy/${strategyId}`))
    );
  }
}
