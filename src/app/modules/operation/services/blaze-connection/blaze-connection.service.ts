import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import jwtDecode from 'jwt-decode';
import { GetBlazeAccessTokenResponse } from './blaze-connection.service.types';

@Injectable({ providedIn: 'root' })
export class BlazeConnectionService {
  private readonly ACCESS_TOKEN_KEY = '@gp/bat';
  private readonly WALLET_ID_KEY = '@gp/bwi';

  constructor(private httpClient: HttpClient) {
    this.loadData();
  }

  async getBlazeAccessToken(email: string, password: string) {
    return await firstValueFrom(
      this.httpClient.put<GetBlazeAccessTokenResponse>(
        'https://blaze.com/api/auth/password',
        {
          username: email,
          password,
        }
      )
    );
  }

  public accessToken = '';
  public walletId = -1;

  loadData() {
    const accessToken = this.getAccessToken();
    const walletId = this.getWalletId();

    accessToken && (this.accessToken = accessToken);
    walletId && (this.walletId = Number(walletId));
  }

  connect(accessToken: string, walletId: string) {
    jwtDecode(accessToken);

    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.WALLET_ID_KEY, walletId);

    this.loadData();
  }

  private getAccessToken() {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  private getWalletId() {
    return localStorage.getItem(this.WALLET_ID_KEY);
  }

  isConnected() {
    return this.getAccessToken() !== null && this.getWalletId() !== null;
  }

  disconnect() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.WALLET_ID_KEY);
  }
}
