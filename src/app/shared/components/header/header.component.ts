import { Component, OnInit } from '@angular/core'
import { ModalService } from './../../services/modal.service'
import { TokenService } from './../../../core/services/token.service'
import { UserService } from './../../../core/services/user.service'
import { BotService } from './../../../modules/operation/services/bot/bot.service'
import {
  fadeInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
} from 'angular-animations'
import { DropdownItems } from '../dropdown/dropdown.component.types'
import { Router } from '@angular/router'
import { RiskManagementApiService } from './../../../modules/operation/services/risk-management-api/risk-managent-api.service'
import { PlatformConnectionService } from './../../../modules/operation/services/platform-connection/platform-connection.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass'],
  animations: [
    fadeInOnEnterAnimation({ duration: 400 }),
    fadeOutOnLeaveAnimation({ duration: 400 }),
  ],
})
export class HeaderComponent implements OnInit {
  constructor(
    private modalService: ModalService,
    private tokenService: TokenService,
    private userService: UserService,
    private botService: BotService,
    private platformConnectionService: PlatformConnectionService,
    private router: Router,
    private riskManagementApiService: RiskManagementApiService
  ) {}

  get isAuthenticated() {
    return this.tokenService.hasToken
  }

  get user() {
    return this.userService.user
  }

  get hasRiskManagement() {
    return !!this.riskManagementApiService.cachedRiskManagement
  }

  isMobileMenuOpen = false

  accountDropdownItems: DropdownItems = [
    {
      text: 'Minha conta',
      icon: 'person',
      handler: this.navigate(() => this.router.navigate(['user'])).bind(this),
    },
    {
      text: 'Deslogar',
      icon: 'logout',
      handler: this.signOut.bind(this),
    },
  ]

  ngOnInit(): void {
    if (this.router.url === '/')
      this.riskManagementApiService.getRiskManagement()

    if (this.user.isAdmin) {
      this.accountDropdownItems.splice(1, 0, {
        text: 'Tokens',
        icon: 'settings',
        handler: this.navigate(() =>
          this.router.navigate(['/admin', 'tokens'])
        ).bind(this),
      })
      this.accountDropdownItems.splice(2, 0, {
        text: 'Assinaturas',
        icon: 'settings',
        handler: this.navigate(() =>
          this.router.navigate(['/admin', 'subscriptions'])
        ).bind(this),
      })
    }
  }

  navigate(callback: () => void) {
    return () => {
      callback()
      this.closeMobileMenu()
    }
  }

  openRiskManagementModal() {
    this.navigate(() => {
      this.modalService.openRaw('risk-management')
    })()
  }

  doSignOut() {
    this.botService.stopBot()
    this.botService.disconnect()
    this.tokenService.clearTokens()
    this.platformConnectionService.disconnectAll()
  }

  signOut() {
    if (this.botService.isOperating) {
      this.modalService.open({
        name: 'confirmation',
        data: {
          title: 'Atenção',
          text: 'O robô está ligado. tem certeza que deseja sair da sua conta? O robô será desligado.',
          onConfirmation: () => {
            this.doSignOut()
          },
        },
      })
      return
    }

    this.doSignOut()
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false
  }
}
