import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { BreadcrumbsService } from './../../../../shared/services/breadcrumbs.service'
import { ModalBlazeConnectionComponent } from './../../components/modal-blaze-connection/modal-blaze-connection.component'
import { BotService } from './../../services/bot/bot.service'
import { ModalService } from './../../../../shared/services/modal.service'
import {
  fadeInOnEnterAnimation,
  jelloAnimation,
  fadeOutOnLeaveAnimation,
  rotateAnimation,
} from 'angular-animations'
import {
  CallRecord,
  OPERATION_STATUS_ICONS,
  OPERATION_STATUS_LABELS,
  Record,
} from './control-panel.component.types'
import { StrategyApiService } from '../../../strategy/services/strategy-api/strategy-api.service'
import { GetBriefUserStrategiesResponse } from '../../../strategy/services/strategy-api/strategy-api.service.types'
import { Subscription } from 'rxjs'
import { ModalViewCallsComponent } from '../../components/modal-view-calls/modal-view-calls.component'
import { ShimmerLoaded } from './../../../../shared/misc/shimmer-loaded'
import { Title } from '@angular/platform-browser'
import { CurrencyPipe } from '@angular/common'
import { ResponsitivyService } from './../../../../shared/services/responsivity.service'
import { BlazeClient } from './../../services/blaze-client/blaze-client.service'
import { BotRecordEventMessage } from '../../services/bot/bot.service.types'
import { RecordApiService } from './../../services/record-api/record-api.service'
import { ModalCallDetailsComponent } from './../../components/modal-call-details/modal-call-details.component'
import {
  RecordEntityList,
  SummaryEntity,
} from '../../services/record-api/record-api.service.types'
import { getCurrentIsoDate } from '../../../../shared/helpers/functions/date/get-current-iso-date.helper'
import { ModalSmashVinculationComponent } from '../../components/modal-smash-vinculation/modal-smash-vinculation.component'
import { ModalCallSettingsComponent } from '../../components/modal-call-settings/modal-call-settings.component'
import { CallSettingsService } from './../../services/call-settings/call-settings.service'
import { Platform } from '../../../../core/blaze/types/platform'
import { PlatformConnectionService } from './../../services/platform-connection/platform-connection.service'

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.sass'],
  animations: [
    jelloAnimation({
      duration: 1000,
    }),
    fadeInOnEnterAnimation(),
    fadeOutOnLeaveAnimation(),
    rotateAnimation({
      degrees: 180,
    }),
  ],
})
export class ControlPanelComponent implements OnInit, OnDestroy, ShimmerLoaded {
  @ViewChild(ModalBlazeConnectionComponent, { static: true })
  modalBlazeConnection: ModalBlazeConnectionComponent

  @ViewChild(ModalSmashVinculationComponent, { static: true })
  modalSmashVinculation: ModalSmashVinculationComponent

  @ViewChild(ModalViewCallsComponent, { static: true })
  modalViewCallsComponent: ModalViewCallsComponent

  @ViewChild(ModalCallDetailsComponent, { static: true })
  modalCallDetailsComponent: ModalCallDetailsComponent

  @ViewChild(ModalCallSettingsComponent, { static: true })
  modalCallSettingsComponent: ModalCallSettingsComponent

  isOperationButtonIconJelling = true
  isOperationButtonHovered = false

  lastBotStatus = ''

  staticActiveStrategies: GetBriefUserStrategiesResponse = []
  operationSummary: SummaryEntity

  records: RecordEntityList = []

  gameIcons = {
    CRASH: 'trending_up',
    DOUBLE: 'view_in_ar',
  }

  nextCallSubscription: Subscription
  retrieveFinishSubscription: Subscription
  onStatusChangeSubscription: Subscription
  onOperationStatusChangeSubscription: Subscription
  onInvalidSubscription: Subscription
  onRecordEvent: Subscription
  onInvalidSmashVinculation: Subscription

  canShowMobileSettings = true

  ACCOUNT_TYPE_KEY = '@gp/batk'

  constructor(
    private breadcrumbsService: BreadcrumbsService,
    private botService: BotService,
    private modalService: ModalService,
    private strategyApiService: StrategyApiService,
    private title: Title,
    private currencyPipe: CurrencyPipe,
    private blazeClient: BlazeClient,
    private recordApiService: RecordApiService,
    private callSettingsService: CallSettingsService,
    private platformConnectionService: PlatformConnectionService,
    public responsitivy: ResponsitivyService
  ) {
    this.title.setTitle('Painel de Controle - Shark')
    this.callSettingsService.load()
    this.loadAccountType()

    document.documentElement.addEventListener('mouseleave', () => {
      this.isOperationButtonHovered = false
    })
  }

  isPlatformConnected(platform: string) {
    return this.platformConnectionService.isConnected(platform as Platform)
  }

  get isShowingOperatingResult() {
    return this.botService.operationStatus !== ''
  }

  get accountType() {
    return this.botService.accountType
  }

  set accountType(value: 'DEMO' | 'REAL') {
    this.botService.accountType = value
    localStorage.setItem(this.ACCOUNT_TYPE_KEY, value)
  }

  getOperationResultLabel() {
    return OPERATION_STATUS_LABELS[
      this.botService.operationStatus as keyof typeof OPERATION_STATUS_LABELS
    ]
  }

  getOperationResultIcon() {
    return OPERATION_STATUS_ICONS[
      this.botService.operationStatus as keyof typeof OPERATION_STATUS_ICONS
    ]
  }

  hasBotStatus(status: string) {
    const isBotStatus = this.botService.botStatus === status

    if (isBotStatus) {
      if (this.lastBotStatus !== status)
        this.isOperationButtonIconJelling = true

      this.lastBotStatus = status
    }

    return isBotStatus
  }

  get botTimerDuration() {
    return this.botService.startDuration
  }

  get botResetTimerDuration() {
    return this.botService.resetDuration
  }

  get isBotRetrieved() {
    return this.botService.isRetrieved
  }

  get blazeRealBalance() {
    const balance = this.blazeClient.serverData.balance
    return balance === -1 ? '---' : this.currencyPipe.transform(balance, 'BRL')
  }

  get balancePercentage() {
    const balance =
      this.accountType === 'REAL'
        ? this.blazeClient.serverData.balance
        : this.operationSummary.totalBalance

    if (balance === -1) return 0

    const result = this.operationSummary.resultBalance
    const initialBalance = balance - result

    return result / initialBalance
  }

  get operatingStrategyName() {
    return this.botService.operationStrategyName
  }

  get activeStrategies() {
    return this.botService.isOperating && this.botService.activeStrategies
      ? this.botService.activeStrategies
      : this.staticActiveStrategies
  }

  isLoaded() {
    return (
      this.botService.isConnected &&
      this.records !== undefined &&
      this.operationSummary !== undefined
    )
  }

  canShowShimmer() {
    return !this.isLoaded()
  }

  loadAccountType() {
    const accountType = localStorage.getItem(this.ACCOUNT_TYPE_KEY)

    if (accountType) {
      this.botService.accountType = accountType as any
      this.connectOrDisconnectToBlaze()
    }
  }

  ngOnInit(): void {
    this.breadcrumbsService.update('Início > Painel de Controle')
    this.botService.tryConnect()

    this.retrieveBot()
    this.subscribeBotEvents()
  }

  ngOnDestroy(): void {
    this.nextCallSubscription.unsubscribe()
    this.retrieveFinishSubscription.unsubscribe()
    this.onStatusChangeSubscription.unsubscribe()
    this.onOperationStatusChangeSubscription.unsubscribe()
    this.onInvalidSubscription.unsubscribe()
    this.onRecordEvent.unsubscribe()

    this.botService.disconnect()
  }

  subscribeBotEvents() {
    this.nextCallSubscription = this.botService.onNextCall$.subscribe({
      next: (record) => {
        if (!record) return

        this.updateSummary(this.addNextRecord(record).call as any)
      },
    })

    this.retrieveFinishSubscription =
      this.botService.onRetrieveFinish$.subscribe({
        next: () => {
          this.updateAll()
        },
      })

    this.onStatusChangeSubscription = this.botService.onStatusChange$.subscribe(
      {
        next: (status) => {
          this.updateTitleByStatus(status)
          this.updateActiveStrategiesIfBotStopped(status)
        },
      }
    )

    this.onOperationStatusChangeSubscription =
      this.botService.onOperationStatusChange$.subscribe({
        next: (status) => {
          this.updateTitleByStatus(status)
        },
      })

    this.onInvalidSubscription =
      this.botService.onInvalidSubscription$.subscribe({
        next: () => {
          this.modalService.open({
            name: 'warning',
            data: {
              title: 'Erro ao iniciar o robô',
              text: 'Você não tem uma assinatura válida.',
            },
          })
        },
      })

    this.onRecordEvent = this.botService.onRecordEvent$.subscribe({
      next: (record) => {
        if (!record) return

        this.addNextRecord(record)
      },
    })

    this.onInvalidSmashVinculation =
      this.botService.onInvalidSmashVinculation$.subscribe({
        next: () => {
          this.modalSmashVinculation.open()
        },
      })
  }

  updateAll() {
    if (!this.botService.isOperating) {
      this.updateActiveStrategies()
    }

    this.updateRecords()
  }

  updateTitleByStatus(status: string) {
    let title = 'Painel de Controle'

    switch (status) {
      case 'WAITING':
        title = 'Buscando Entrada'
        break
      case 'STOP_GAIN':
        title = 'Stop Gain'
        break
      case 'STOP_LOSS':
        title = 'Stop Loss'
        break
      case 'OPERATING':
        title = `Operando`
        break
      case 'ERRORED':
        title = 'Ocorreu um erro ao operar'
        break
      case 'WIN':
        title = 'Vitória'
        break
      case 'LOSS':
        title = 'Derrota'
        break
      case 'TIME_RST':
        title = 'Aguardando'
        break
    }

    this.title.setTitle(`${title} [${this.accountType}] - Shark`)
  }

  updateActiveStrategiesIfBotStopped(status: string) {
    if (status !== 'STOPPED') return

    this.updateActiveStrategies()
  }

  async updateActiveStrategies() {
    await this.strategyApiService
      .getBriefActiveUserStrategies()
      .then((strategies) => (this.staticActiveStrategies = strategies))
  }

  updateRecords() {
    const currentDate = getCurrentIsoDate()

    this.recordApiService
      .getRecords(1, 14, currentDate, currentDate, this.accountType)
      .then((records: any) => {
        this.records = records.data
        this.operationSummary = records.summary
      })
  }

  openBlazeConnectionModal(platform: string) {
    this.modalBlazeConnection.openWithParams({
      platform: platform as Platform,
    })
  }

  disconnectFromPlatform(platform: string) {
    if (this.botService.isOperating) {
      this.modalService.open({
        name: 'warning',
        data: {
          title: 'Erro ao desconectar',
          text: 'O robô está operando.',
        },
      })
      return
    }

    this.platformConnectionService.disconnect(platform as Platform)
  }

  async startBot() {
    await this.updateActiveStrategies()

    const hasActiveStrategies = this.activeStrategies.length > 0

    if (!hasActiveStrategies) {
      this.modalService.open({
        name: 'warning',
        data: {
          title: 'Erro ao iniciar o robô',
          text: 'Você não tem nenhuma estratégia ativa.',
        },
      })
      return
    }

    const platforms: Platform[] = []

    this.activeStrategies.forEach(
      (strategy) =>
        !platforms.includes(strategy.platform) &&
        platforms.push(strategy.platform)
    )

    if (
      this.accountType === 'REAL' &&
      platforms.some(
        (platform) => !this.platformConnectionService.isConnected(platform)
      )
    ) {
      this.modalService.open({
        name: 'warning',
        data: {
          title: 'Erro ao iniciar o robô',
          text:
            platforms.length > 1
              ? 'Você não está conectado na(s) plataforma(s).'
              : 'Você não está conectado na plataforma.',
        },
      })
      return
    }

    this.botService.startBot(platforms)
  }

  stopBot() {
    let text = ''

    if (this.botService.botStatus === 'OPERATING') {
      text =
        'Existe uma operação em andamento. Você tem certeza que deseja parar o robô?'
    } else {
      text = 'Você tem certeza que deseja parar o robô?'
    }

    this.modalService.open({
      name: 'confirmation',
      data: {
        title: 'Atenção',
        text,
        onConfirmation: () => {
          this.botService.stopBot()
        },
      },
    })
  }

  getStrategyGameIcon(game: string) {
    return this.gameIcons[game as keyof typeof this.gameIcons]
  }

  addNextRecord(record: Record) {
    const transformedRecord = this.transformRecord(record)
    this.records.unshift(transformedRecord as any)

    if (this.records.length > 14) this.records.pop()

    return transformedRecord
  }

  transformRecord(record: Record) {
    if (record.call) {
      return {
        ...record,
        call: {
          ...record.call,
          result: Number(record.call.result),
        },
        createdAt: new Date(record.createdAt),
      }
    }

    return { ...record, createdAt: new Date(record.createdAt) }
  }

  updateSummary(call: CallRecord) {
    const summary = this.operationSummary

    if (!summary) return

    summary.operationCount++
    summary.resultBalance += call.result

    if (this.accountType === 'DEMO') summary.totalBalance += call.result

    if (call.status === 'WIN') {
      summary.score.wins++
    } else {
      summary.score.losses++
    }
  }

  addNextEventRecord(record: BotRecordEventMessage) {
    this.records.push(record as any)
  }

  switchAccountType(type: string) {
    if (this.botService.isOperating) {
      this.modalService.open({
        name: 'warning',
        data: {
          title: 'Atenção',
          text: `O robô está operando. Não é possível trocar para conta ${type}.`,
        },
      })
      return
    }

    if (type === 'REAL') {
      this.modalService.open({
        name: 'warning',
        data: {
          title: 'Atenção',
          text: 'Você trocou para conta REAL. Todas as operações serão realizadas com o saldo das plataformas.',
        },
      })
    }

    this.accountType = type as any

    this.updateAll()
    this.connectOrDisconnectToBlaze()
  }

  connectOrDisconnectToBlaze() {
    this.accountType === 'REAL'
      ? this.blazeClient.connect()
      : this.blazeClient.disconnect()
  }

  retrieveBot() {
    this.botService.tryRetrieveBot()
  }

  openViewCallsModal() {
    this.modalViewCallsComponent.openWithParams({
      accountType: this.accountType,
    })
  }

  tryDeleteCalls() {
    this.modalService.open({
      name: 'confirmation',
      data: {
        title: 'Atenção',
        text: 'Você tem certeza que deseja apagar as operações do dia?',
        onConfirmation: () => {
          this.recordApiService
            .deleteRecordsByDay(this.accountType)
            .then(() => {
              this.updateRecords()
            })
            .catch(() => {
              this.modalService.open({
                name: 'warning',
                data: {
                  title: 'Erro',
                  text: 'Não foi possível apagar as operações',
                },
              })
            })
        },
      },
    })
  }

  getCallMiscBetHistory(betHistory: number[]) {
    return betHistory
      .map((bet) => this.currencyPipe.transform(bet, 'BRL'))
      .join(' | ')
  }

  viewCallDetails(recordId: string) {
    this.modalCallDetailsComponent.openWithParams({
      recordId,
    })
  }
}
