import { Injectable } from '@angular/core'
import { Platform } from '../../../../core/blaze/types/platform'

@Injectable({
  providedIn: 'root',
})
export class PlatformConnectionService {
  private readonly KEY = '@gp/p'

  private connections = {
    [Platform.BLAZE]: '',
    [Platform.SMASH]: '',
  }

  constructor() {
    this.load()
  }

  private tryLoadOldBlazeToken() {
    const ACCESS_TOKEN_KEY = '@gp/bat'
    const WALLET_ID_KEY = '@gp/bwi'

    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
    const walletId = localStorage.getItem(WALLET_ID_KEY)

    if (accessToken !== null && walletId !== null) {
      this.connections[Platform.BLAZE] = `${accessToken};${walletId}`

      localStorage.removeItem(ACCESS_TOKEN_KEY)
      localStorage.removeItem(WALLET_ID_KEY)
    }
  }

  private load() {
    const loaded = localStorage.getItem(this.KEY)

    if (!loaded) {
      this.tryLoadOldBlazeToken()
      this.save()
    } else {
      this.connections = JSON.parse(loaded as any)
    }
  }

  private save() {
    localStorage.setItem(this.KEY, JSON.stringify(this.connections))
  }

  read(platform: Platform) {
    return this.connections[platform]
  }

  isConnected(platform: Platform) {
    return this.connections[platform] !== ''
  }

  connect(platform: Platform, accessToken: string) {
    this.connections[platform] = accessToken
    this.save()
  }

  disconnect(platform: Platform) {
    this.connections[platform] = ''
    this.save()
  }

  disconnectAll() {
    Object.keys(this.connections).forEach((platform: string) => {
      this.connections[platform as Platform] = ''
    })
    this.save()
  }
}
