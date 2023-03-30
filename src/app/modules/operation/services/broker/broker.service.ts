import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from '../../../../../environments/environment';
import { TokenService } from './../../../../core/services/token.service';

@Injectable({
  providedIn: 'root',
})
export class BrokerService extends Socket {
  constructor(private tokenService: TokenService) {
    super({
      url: environment.brokerUrl,
      options: {
        autoConnect: false,
      },
    });
  }

  applyAuthentication() {
    this.ioSocket['auth'] = { token: this.tokenService.jwtToken };
  }
}
