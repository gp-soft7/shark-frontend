import { Injectable } from '@angular/core'
import { AuthApiService } from './auth-api/auth-api.service'
import { TokenService } from './token.service'

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private authApiService: AuthApiService,
    private tokenService: TokenService
  ) {}

  async signIn(email: string, password: string) {
    try {
      const data = await this.authApiService.signIn(email, password)

      this.tokenService.jwtToken = data.accessToken
      this.tokenService.jwtRefreshToken = data.refreshToken

      return true
    } catch {
      return false
    }
  }
}
