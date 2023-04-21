import { Injectable } from '@angular/core'
import {
  differenceInSeconds,
  formatDuration,
  intervalToDuration,
  isAfter,
  subSeconds,
} from 'date-fns'
import { BehaviorSubject, Subject } from 'rxjs'
import ptBRLocale from 'date-fns/locale/pt-BR'
import { BotRecordEventMessage, BotRetrieveMessage } from './bot.service.types'
import { BrokerService } from './../broker/broker.service'
import { Record } from '../../pages/control-panel/control-panel.component.types'
import { GetBriefUserStrategiesResponse } from '../../../strategy/services/strategy-api/strategy-api.service.types'
import { PlatformConnectionService } from './../platform-connection/platform-connection.service'
import { Platform } from '../../../../core/blaze/types/platform'

@Injectable({ providedIn: 'root' })
export class BotService {
  botStatus = 'STOPPED'
  operationStatus = ''
  operationStrategyName: string

  startDuration = ''
  startTimer: any
  startDate: Date

  resetDuration = ''
  resetTimer: any
  resetDate: Date

  onNextCall$ = new BehaviorSubject<Record | null>(null)
  onRetrieveFinish$ = new Subject()
  onBotsRetrieved$ = new BehaviorSubject<any>(null)
  onStatusChange$ = new Subject<string>()
  onOperationStatusChange$ = new BehaviorSubject<string>(this.operationStatus)
  onInvalidSubscription$ = new Subject()
  onInvalidSmashVinculation$ = new Subject()
  onRecordEvent$ = new BehaviorSubject<BotRecordEventMessage | null>(null)

  statusEvents: { [status: string]: () => void } = {}
  isRetrieved = false
  accountType: 'DEMO' | 'REAL' = 'DEMO'

  activeStrategies: GetBriefUserStrategiesResponse

  constructor(
    private broker: BrokerService,
    private platformConnectionService: PlatformConnectionService
  ) {
    this.attachEvents()
    this.defineStatusEvents()
  }

  tryConnect() {
    this.broker.applyAuthentication()

    if (!this.broker.ioSocket.connected) this.broker.connect()
  }

  disconnect() {
    this.broker.disconnect()
  }

  attachEvents() {
    this.broker.on('status', this.onBotStatus.bind(this))
    this.broker.on('operation-status', this.onBotOperationStatus.bind(this))
    this.broker.on(
      'operation-strategy-name',
      this.onBotOperationStrategyName.bind(this)
    )
    this.broker.on('call', this.onBotCall.bind(this))
    this.broker.on('start-date', this.onBotStartDate.bind(this))
    this.broker.on('reset-date', this.onBotResetDate.bind(this))
    this.broker.on('retrieved', this.onBotRetrieved.bind(this))
    this.broker.on('retrieve-finish', this.onBotRetrieveFinish.bind(this))
    this.broker.on('account-type', this.onBotAccountType.bind(this))
    this.broker.on('active-strategies', this.onBotActiveStrategies.bind(this))
    this.broker.on('admin-bots-retrieved', this.onAdminBotsRetrieved.bind(this))
    this.broker.on(
      'invalid-subscription',
      this.onInvalidSubscription.bind(this)
    )
    this.broker.on(
      'invalid-smash-vinculation',
      this.onInvalidSmashVinculation.bind(this)
    )
    this.broker.on('record-event', this.onRecordEvent.bind(this))
    this.broker.on('disconnect', this.onDisconnect.bind(this))
  }

  get isOperating() {
    return this.botStatus === 'WAITING' || this.botStatus === 'OPERATING'
  }

  get isConnected() {
    return this.broker.ioSocket.connected
  }

  onBotStatus(status: string) {
    this.botStatus = status
    this.statusEvents[status]()
    this.onStatusChange$.next(status)
  }

  onBotOperationStatus(status: string) {
    setTimeout(() => {
      this.operationStatus = status
      this.onOperationStatusChange$.next(status)

      setTimeout(() => {
        this.operationStatus = ''
        this.onOperationStatusChange$.next('')
      }, 8e3)
    }, 10)
  }

  onBotOperationStrategyName(name: string) {
    this.operationStrategyName = name
  }

  onBotStartDate(date: string) {
    this.startStartTimer(date)
  }

  onBotResetDate(date: string) {
    this.startResetTimer(date)
  }

  onBotRetrieved() {
    this.isRetrieved = true
  }

  onBotRetrieveFinish() {
    this.onRetrieveFinish$.next(null)
  }

  onBotAccountType(accountType: string) {
    this.accountType = accountType as any
  }

  onBotActiveStrategies(strategies: any) {
    this.activeStrategies = strategies
  }

  onDisconnect() {
    this.botStatus = 'STOPPED'
  }

  onBotCall(record: Record) {
    this.onNextCall$.next(record)
  }

  tryRetrieveBot() {
    this.isRetrieved = false
    this.broker.emit('retrieve-bot')
  }

  defineStatusEvents() {
    this.statusEvents['WAITING'] = this.onStatusWaiting.bind(this)
    this.statusEvents['STOPPED'] = this.onStatusStopped.bind(this)
    this.statusEvents['STOP_GAIN'] = this.onStatusStopGain.bind(this)
    this.statusEvents['STOP_LOSS'] = this.onStatusStopLoss.bind(this)
    this.statusEvents['OPERATING'] = this.onStatusOperating.bind(this)
    this.statusEvents['ERRORED'] = this.onStatusErrored.bind(this)
    this.statusEvents['TIME_RST'] = this.onStatusTimeRestricted.bind(this)
  }

  startBot(platforms: Platform[]) {
    this.activeStrategies = undefined as any
    const accountType = this.accountType

    const args: any = {
      accountType,
    }

    if (accountType === 'REAL') {
      args.accessTokens = platforms.map((platform) => ({
        platform,
        token: this.platformConnectionService.read(platform),
      }))
    }

    this.broker.emit('start-bot', args)

    this.botStatus = 'STARTING'
  }

  stopBot() {
    this.broker.emit('stop-bot')
    this.operationStatus = ''
  }

  updateStartDuration() {
    if (isAfter(this.startDate, new Date())) {
      this.startDate = subSeconds(
        this.startDate,
        differenceInSeconds(this.startDate, new Date()) + 1
      )
    }

    this.startDuration = formatDuration(
      intervalToDuration({
        start: new Date(),
        end: this.startDate,
      }),
      {
        locale: ptBRLocale,
      }
    )
  }

  startStartTimer(date: string) {
    this.startDate = new Date(date)
    this.startDuration = 'Iniciando em breve'

    this.updateStartDuration()

    this.startTimer = setInterval(() => {
      this.updateStartDuration()
    }, 1000)
  }

  stopStartTimer() {
    clearInterval(this.startTimer)
    this.startDuration = ''
  }

  updateResetDuration() {
    if (isAfter(new Date(), this.resetDate)) {
      this.resetDuration = 'breve'
      return
    }

    this.resetDuration = formatDuration(
      intervalToDuration({
        start: new Date(),
        end: this.resetDate,
      }),
      {
        locale: ptBRLocale,
      }
    )
  }

  startResetTimer(date: string) {
    this.resetDate = new Date(date)
    this.resetTimer = setInterval(() => {
      this.updateResetDuration()
    }, 1000)

    this.updateResetDuration()
  }

  stopResetTimer() {
    clearInterval(this.resetTimer)
  }

  retrieveData(data: BotRetrieveMessage) {
    this.statusEvents[data.status]()

    this.resetDate = new Date(data.resetDate)
    this.startDate = new Date(data.startDate)
    this.botStatus = data.status
  }

  retrieveBots() {
    this.broker.emit('admin-retrieve-bots')
  }

  simulateCrashGame(game: number) {
    this.broker.emit('admin-simulate-crash-game', game)
  }

  simulateDoubleGame(color: number, roll: number) {
    this.broker.emit('admin-simulate-double-game', color, roll)
  }

  onAdminBotsRetrieved(data: any) {
    this.onBotsRetrieved$.next(JSON.parse(data))
  }

  onInvalidSubscription() {
    this.onInvalidSubscription$.next(null)
  }

  onInvalidSmashVinculation() {
    this.onInvalidSmashVinculation$.next(null)
  }

  onRecordEvent(data: any) {
    this.onRecordEvent$.next(data)
  }

  onStatusWaiting() {
    this.stopResetTimer()
  }

  onStatusStopped() {
    this.stopStartTimer()
  }

  onStatusStopGain() {
    this.operationStatus = ''
    this.stopStartTimer()
  }

  onStatusStopLoss() {
    this.operationStatus = ''
    this.stopStartTimer()
  }

  onStatusOperating() {}

  onStatusErrored() {}

  onStatusTimeRestricted() {}
}
