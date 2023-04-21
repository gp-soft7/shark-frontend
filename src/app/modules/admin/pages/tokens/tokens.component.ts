import { Component, OnInit } from '@angular/core'
import { BreadcrumbsService } from './../../../../shared/services/breadcrumbs.service'
import { ThirdPartyTokenApiService } from './../../services/third-party-token-api.service'
import { ModalService } from './../../../../shared/services/modal.service'

@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.sass'],
})
export class TokensComponent implements OnInit {
  tokenUserSmash = ''
  tokenAffiliateSmash = ''

  constructor(
    private breadcrumbsService: BreadcrumbsService,
    private thirdPartyTokenApiService: ThirdPartyTokenApiService,
    private modalService: ModalService
  ) {
    this.breadcrumbsService.update('Início > Administração > Tokens')
  }

  ngOnInit() {
    this.tryLoadToken('SMASH_USER', (token) => {
      this.tokenUserSmash = token
    })

    this.tryLoadToken('SMASH_USER_AFFILIATE', (token) => {
      this.tokenAffiliateSmash = token
    })
  }

  async tryLoadToken(key: string, callback: (token: string) => void) {
    try {
      const { token } = await this.thirdPartyTokenApiService.getByKey(key)
      callback(token)
    } catch {}
  }

  async updateToken(key: string, token: string) {
    try {
      await this.thirdPartyTokenApiService.upsertByKey(key, token)
      this.modalService.open({
        name: 'success',
        data: {
          text: 'Token atualizado com sucesso',
        },
      })
    } catch {
      this.modalService.open({
        name: 'warning',
        data: {
          text: 'Não foi possível atualizar o token',
        },
      })
    }
  }
}
