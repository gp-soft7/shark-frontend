import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { apiUrl } from '../../../../shared/helpers/functions/api-url.helper';

@Injectable({ providedIn: 'root' })
export class RiskManagementApiService {
  constructor(private httpClient: HttpClient) {}

  cachedRiskManagement: any;

  async createRiskManagement(data: any) {
    return await firstValueFrom(
      this.httpClient.post(apiUrl('risk-management'), data)
    );
  }

  updateRiskManagementCache(data: any) {
    this.cachedRiskManagement = data;
  }

  getRiskManagement() {
    return new Promise((resolve, reject) => {
      if (this.cachedRiskManagement) {
        return resolve(this.cachedRiskManagement);
      }

      firstValueFrom(this.httpClient.get(apiUrl('risk-management')))
        .then(({ riskManagement }: any) => {
          if (riskManagement !== '{"restartOnNextDay":false}') {
            this.cachedRiskManagement = riskManagement;
            resolve(riskManagement);
          } else {
            reject();
          }
        })
        .catch(reject);
    });
  }
}
