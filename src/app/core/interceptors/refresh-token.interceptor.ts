import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError, switchMap } from 'rxjs';
import { TokenService } from '../services/token.service';
import { AuthApiService } from './../services/auth-api/auth-api.service';
import { BotService } from './../../modules/operation/services/bot/bot.service';
import { BlazeConnectionService } from './../../modules/operation/services/blaze-connection/blaze-connection.service';
import { UserService } from './../services/user.service';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  constructor(
    private tokenService: TokenService,
    private authService: AuthApiService,
    private botService: BotService,
    private blazeConnectionService: BlazeConnectionService,
    private userService: UserService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          !request.url.includes('auth') &&
          request.headers.has('Authorization') &&
          error.status === 401 &&
          this.tokenService.hasToken
        ) {
          return this.handleUnauthorizedError(request, next);
        }

        return throwError(() => error);
      })
    );
  }

  private handleUnauthorizedError(
    request: HttpRequest<any>,
    next: HttpHandler
  ) {
    return this.authService
      .refreshToken(this.tokenService.jwtRefreshToken, this.userService.user.id)
      .pipe(
        switchMap(({ accessToken, refreshToken }) => {
          this.tokenService.jwtToken = accessToken;
          this.tokenService.jwtRefreshToken = refreshToken;

          const authRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${this.tokenService.jwtToken}`,
            },
          });

          return next.handle(authRequest);
        }),
        catchError((error) => {
          this.botService.stopBot();
          this.botService.disconnect();
          this.tokenService.clearTokens();
          this.blazeConnectionService.disconnect();

          return throwError(() => error);
        })
      );
  }
}
