import { Component, OnInit } from '@angular/core';
import { ModalService } from './../../services/modal.service';
import { TokenService } from './../../../core/services/token.service';
import { UserService } from './../../../core/services/user.service';
import { BotService } from './../../../modules/operation/services/bot/bot.service';
import {
  fadeInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
} from 'angular-animations';
import { BlazeConnectionService } from '../../../modules/operation/services/blaze-connection/blaze-connection.service';
import { DropdownItems } from '../dropdown/dropdown.component.types';
import { Router } from '@angular/router';
import { RiskManagementApiService } from './../../../modules/operation/services/risk-management-api/risk-managent-api.service';

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
    private blazeConnectionService: BlazeConnectionService,
    private router: Router,
    private riskManagementApiService: RiskManagementApiService
  ) {}

  get isAuthenticated() {
    return this.tokenService.hasToken;
  }

  get user() {
    return this.userService.user;
  }

  get hasRiskManagement() {
    return !!this.riskManagementApiService.cachedRiskManagement;
  }

  isMobileMenuOpen = false;

  accountDropdownItems: DropdownItems = [
    {
      text: 'Minha conta',
      icon: 'person',
      handler: this.navigateToMyAccount.bind(this),
    },
    {
      text: 'Deslogar',
      icon: 'logout',
      handler: this.signOut.bind(this),
    },
  ];

  ngOnInit(): void {
    if (this.router.url === '/')
      this.riskManagementApiService.getRiskManagement();
  }

  navigateToMyAccount() {
    this.router.navigate(['user']);
    this.closeMobileMenu();
  }

  openRiskManagementModal() {
    this.modalService.openRaw('risk-management');
    this.closeMobileMenu();
  }

  doSignOut() {
    this.botService.stopBot();
    this.botService.disconnect();
    this.tokenService.clearTokens();
    this.blazeConnectionService.disconnect();
  }

  signOut() {
    if (this.botService.isOperating) {
      this.modalService.open({
        name: 'confirmation',
        data: {
          title: 'Atenção',
          text: 'O robô está ligado. tem certeza que deseja sair da sua conta? O robô será desligado.',
          onConfirmation: () => {
            this.doSignOut();
          },
        },
      });
      return;
    }

    this.doSignOut();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }
}
