import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router'
import { UserService } from './../services/user.service'
import { TokenService } from './../services/token.service'

@Injectable({ providedIn: 'root' })
export class AdminAuthGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.userService.user) this.tokenService.loadUserFromLocalStorage()

    const canActivate = this.userService.user.isAdmin

    if (!canActivate) {
      this.router.navigate(['signin'])
    }

    return canActivate
  }
}
