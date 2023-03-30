import { Component, OnInit, ViewChild } from '@angular/core';
import { BreadcrumbsService } from './../../../../shared/services/breadcrumbs.service';
import { ShimmerLoaded } from './../../../../shared/misc/shimmer-loaded';
import { generateRandomWidths } from './../../../../shared/misc/random-widths';
import {
  GetUserProfileResponse,
  GetUserSubscriptionResponse,
} from '../../services/user-api/user-api.service.types';
import { UserApiService } from '../../services/user-api/user-api.service';
import { Title } from '@angular/platform-browser';
import { ModalChangePasswordComponent } from '../../components/modal-change-password/modal-change-password.component';

const SUBSCRIPTION_STATUS = {
  ACTIVE: 'Ativa',
  CANCELED: 'Cancelada',
  EXPIRED: 'Expirada',
};

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.sass'],
})
export class MyAccountComponent implements OnInit, ShimmerLoaded {
  constructor(
    private breadcrumbsService: BreadcrumbsService,
    private userApiService: UserApiService,
    private title: Title
  ) {
    this.title.setTitle('Minha conta - Shark');
  }

  @ViewChild(ModalChangePasswordComponent, { static: true })
  modalChangePasswordComponent: ModalChangePasswordComponent;

  async ngOnInit() {
    this.breadcrumbsService.update('Início > Minha Conta');

    await this.loadUserProfile();
    await this.loadUserSubscription();
  }

  dataItemWidths = generateRandomWidths(8);

  userProfile: GetUserProfileResponse;
  userSubscription: GetUserSubscriptionResponse;

  async loadUserProfile() {
    this.userProfile = await this.userApiService.getUserProfile();
  }

  async loadUserSubscription() {
    this.userSubscription = await this.userApiService.getUserSubscription();
  }

  canShowShimmer(): boolean {
    return (
      this.userProfile === undefined && this.userSubscription === undefined
    );
  }

  isLoaded(): boolean {
    return (
      this.userProfile !== undefined && this.userSubscription !== undefined
    );
  }

  getSubscriptionStatus() {
    return SUBSCRIPTION_STATUS[
      this.userSubscription.status as keyof typeof SUBSCRIPTION_STATUS
    ];
  }
}
