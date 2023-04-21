import { Component, OnInit, ViewChild } from '@angular/core';
import { BreadcrumbsService } from './../../../../shared/services/breadcrumbs.service';
import { ShimmerLoaded } from './../../../../shared/misc/shimmer-loaded';
import { generateRandomWidths } from './../../../../shared/misc/random-widths';
import { GetUserProfileResponse } from '../../services/user-api/user-api.service.types';
import { UserApiService } from '../../services/user-api/user-api.service';
import { Title } from '@angular/platform-browser';
import { ModalChangePasswordComponent } from '../../components/modal-change-password/modal-change-password.component';
import { ModalService } from './../../../../shared/services/modal.service';

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
    private modalService: ModalService,
    private title: Title
  ) {
    this.title.setTitle('Minha conta - Shark');
  }

  @ViewChild(ModalChangePasswordComponent, { static: true })
  modalChangePasswordComponent: ModalChangePasswordComponent;

  async ngOnInit() {
    this.breadcrumbsService.update('Início > Minha Conta');

    await this.loadUserProfile();
  }

  dataItemWidths = generateRandomWidths(8);

  userProfile: GetUserProfileResponse;

  async loadUserProfile() {
    this.userProfile = await this.userApiService.getUserProfile();
  }

  canShowShimmer(): boolean {
    return this.userProfile === undefined;
  }

  isLoaded(): boolean {
    return this.userProfile !== undefined;
  }

  getSubscriptionStatus() {
    return SUBSCRIPTION_STATUS[
      this.userProfile.subscription?.status as keyof typeof SUBSCRIPTION_STATUS
    ];
  }

  unvinculate(vinculationId: string) {
    this.modalService.open({
      name: 'confirmation',
      data: {
        title: 'Atenção',
        text: 'Você tem certeza que deseja desvincular essa conta?',
        onConfirmation: async () => {
          await this.userApiService.unvinculatePlatform(vinculationId);

          const vinculationIndex = this.userProfile.vinculations.findIndex(
            (vinculation) => vinculation.id === vinculationId
          );

          if (vinculationIndex > -1) {
            this.userProfile.vinculations.splice(vinculationIndex, 1);
          }
        },
      },
    });
  }
}
