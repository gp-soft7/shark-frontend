import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly JWT_TOKEN_KEY = '@sk/t';
  private readonly JWT_REFRESH_TOKEN_KEY = '@sk/rt';

  private _jwtToken = '';
  private _jwtRefreshToken = '';

  constructor(private userService: UserService) {
    this.loadUserFromLocalStorage();
  }

  get jwtToken() {
    return this._jwtToken;
  }

  set jwtToken(value: string) {
    this._jwtToken = value;
    this.userService.loadUserFromJwtToken(value);

    this.saveToLocalStorage(this.JWT_TOKEN_KEY, value);
  }

  get jwtRefreshToken() {
    return this._jwtRefreshToken;
  }

  set jwtRefreshToken(value: string) {
    this._jwtRefreshToken = value;

    this.saveToLocalStorage(this.JWT_REFRESH_TOKEN_KEY, value);
  }

  get hasToken() {
    return this._jwtToken !== '' && this._jwtRefreshToken !== '';
  }

  private loadFromLocalStorage(key: string) {
    return localStorage.getItem(key);
  }

  public loadUserFromLocalStorage() {
    const jwtToken = this.loadFromLocalStorage(this.JWT_TOKEN_KEY);
    const jwtRefreshToken = this.loadFromLocalStorage(
      this.JWT_REFRESH_TOKEN_KEY
    );

    if (jwtToken !== null && jwtRefreshToken !== null) {
      this._jwtToken = jwtToken;
      this._jwtRefreshToken = jwtRefreshToken;

      if (!this.userService.loadUserFromJwtToken(jwtToken)) {
        this.clearTokens();
      }
    }
  }

  private saveToLocalStorage(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  public clearTokens() {
    localStorage.removeItem(this.JWT_TOKEN_KEY);
    localStorage.removeItem(this.JWT_REFRESH_TOKEN_KEY);

    this._jwtToken = '';
    this._jwtRefreshToken = '';

    this.userService.clearUser();
  }
}
