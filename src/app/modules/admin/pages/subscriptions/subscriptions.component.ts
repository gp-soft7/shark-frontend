import { Component, OnInit } from '@angular/core'
import { BreadcrumbsService } from './../../../../shared/services/breadcrumbs.service'
import { UserApiService } from './../../../user/services/user-api/user-api.service'
import { ModalService } from './../../../../shared/services/modal.service'

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.sass'],
})
export class SubscriptionsComponent implements OnInit {
  emailToAddSubscription = ''
  emailToRemoveSubscription = ''

  constructor(
    private breadcrumbsService: BreadcrumbsService,
    private userApiService: UserApiService,
    private modalService: ModalService
  ) {
    this.breadcrumbsService.update('Início > Administração > Assinaturas')
  }

  ngOnInit() {}

  async addSubscription() {
    try {
      await this.userApiService.addSubscription(this.emailToAddSubscription)
      this.modalService.open({
        name: 'success',
        data: {
          text: 'Assinatura adicionada com sucesso',
        },
      })
      this.emailToAddSubscription = ''
    } catch {
      this.modalService.open({
        name: 'warning',
        data: {
          text: 'Não foi possível adicionar a assinatura',
        },
      })
    }
  }

  async removeSubscription() {
    try {
      await this.userApiService.removeSubscription(
        this.emailToRemoveSubscription
      )
      this.modalService.open({
        name: 'success',
        data: {
          text: 'Assinatura removida com sucesso',
        },
      })
      this.emailToRemoveSubscription = ''
    } catch {
      this.modalService.open({
        name: 'warning',
        data: {
          text: 'Não foi possível remover a assinatura',
        },
      })
    }
  }
}
