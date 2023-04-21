import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { apiUrl } from '../../../shared/helpers/functions/api-url.helper'
import { firstValueFrom } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class ThirdPartyTokenApiService {
  constructor(private httpClient: HttpClient) {}

  async getByKey(key: string) {
    return await firstValueFrom(
      this.httpClient.get<GetThirdPartyTokenByKeyResponse>(
        apiUrl(`third-party-token/${key}`)
      )
    )
  }

  async upsertByKey(key: string, token: string) {
    return await firstValueFrom(
      this.httpClient.post(apiUrl('third-party-token'), { key, token })
    )
  }
}

export type GetThirdPartyTokenByKeyResponse = {
  key: string
  token: string
  createdAt: string
  updatedAt: string
}
