import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from './../../../../shared/helpers/functions/api-url.helper';
import {
  GetCallRecordResponse,
  GetRecordsResponse,
} from './record-api.service.types';

@Injectable({ providedIn: 'root' })
export class RecordApiService {
  constructor(private httpClient: HttpClient) {}

  async getRecords(
    page = 1,
    take = 14,
    startDate: string,
    endDate: string,
    accountType: 'DEMO' | 'REAL'
  ) {
    const data = await firstValueFrom(
      this.httpClient.get(
        apiUrl(
          `record?page=${page}&take=${take}&startDate=${startDate}&endDate=${endDate}&accountType=${accountType}`
        )
      )
    );

    return this.transformGetRecords(data);
  }

  async getCallRecord(recordId: string) {
    return await firstValueFrom(
      this.httpClient.get<GetCallRecordResponse>(
        apiUrl(`record/call/${recordId}`)
      )
    );
  }

  async deleteRecordsByDay(accountType: 'DEMO' | 'REAL') {
    await firstValueFrom(
      this.httpClient.delete(apiUrl(`record?accountType=${accountType}`))
    );
  }

  private transformGetRecords(response: any): GetRecordsResponse {
    return {
      ...response,
      data: response.data.map((item: any) => {
        return {
          ...item,
          call: item.call
            ? {
                ...item.call,
                result: Number(item.call.result),
              }
            : null,
          createdAt: new Date(item.createdAt),
        };
      }),
    };
  }
}
