import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core'
import {
  BlazeValidationPlan,
  CreateStrategyTabs,
  SmashValidationPlan,
} from './create-strategy.component.types'
import { ModalService } from './../../../../shared/services/modal.service'
import { ModalChangeStrategyNameComponent } from './../../components/modal-change-strategy-name/modal-change-strategy-name.component'
import { BreadcrumbsService } from './../../../../shared/services/breadcrumbs.service'
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { StrategyApiService } from './../../services/strategy-api/strategy-api.service'
import { GetUserStrategyResponse } from '../../services/strategy-api/strategy-api.service.types'
import { CrashPatternsComponent } from './../../components/crash-patterns/crash-patterns.component'
import { DoublePatternsComponent } from './../../components/double-patterns/double-patterns.component'
import { RiskManagementComponent } from './../../components/risk-management/risk-management.component'
import { LeverageComponent } from '../../components/leverage/leverage.component'
import { BotService } from './../../../operation/services/bot/bot.service'
import { ShimmerLoaded } from './../../../../shared/misc/shimmer-loaded'
import { Title } from '@angular/platform-browser'
import { ResponsitivyService } from './../../../../shared/services/responsivity.service'
import { TimePatternsComponent } from '../../components/time-patterns/time-patterns.component'
import { Platform } from '../../../../core/blaze/types/platform'

@Component({
  selector: 'app-create-strategy',
  templateUrl: './create-strategy.component.html',
  styleUrls: ['./create-strategy.component.sass'],
})
export class CreateStrategyComponent
  implements OnInit, AfterViewInit, ShimmerLoaded
{
  form: FormGroup
  currentTab = 'patterns'

  isEditing = false
  isEditingId = ''
  strategyData: any = {}

  tabs: CreateStrategyTabs = [
    {
      topic: 'entry',
      items: [
        {
          name: 'patterns',
          text: 'Entrada por padrões',
          icon: 'pattern',
        },
        {
          name: 'time',
          text: 'Entrada por horário',
          icon: 'alarm',
        },
      ],
    },
    {
      topic: 'risk',
      items: [
        {
          name: 'risk-management',
          text: 'Gerenciamento de Risco',
          icon: 'settings_suggest',
        },
        {
          name: 'leverage',
          text: 'Alavancagem',
          icon: 'moving',
        },
      ],
    },
  ]

  platformValidationPlans = {
    [Platform.BLAZE]: BlazeValidationPlan,
    [Platform.SMASH]: SmashValidationPlan,
  }

  @ViewChild(ModalChangeStrategyNameComponent, { static: true })
  modalChangeStrategyNameComponent: ModalChangeStrategyNameComponent

  @ViewChild('crashPatterns')
  crashPatternsComponent: CrashPatternsComponent

  @ViewChild('doublePatterns')
  doublePatternsComponent: DoublePatternsComponent

  @ViewChild('timePatterns')
  timePatternsComponent: TimePatternsComponent

  @ViewChild(RiskManagementComponent, { static: true })
  riskManagementComponent: RiskManagementComponent

  @ViewChild(LeverageComponent, { static: true })
  leverageComponent: LeverageComponent

  isStrategyLoaded = false

  constructor(
    private modalService: ModalService,
    private breadcrumbsService: BreadcrumbsService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private strategyApiService: StrategyApiService,
    private botService: BotService,
    private title: Title,
    public responsitivy: ResponsitivyService
  ) {
    this.title.setTitle('Nova estratégia - Shark')
  }

  get isBotOperating() {
    return this.botService.isOperating
  }

  get strategyName() {
    return this.getFormControlValue('name')
  }

  get strategyGame() {
    return this.getFormControlValue('game')
  }

  get strategyPlatform() {
    return this.getFormControlValue('platform')
  }

  ngOnInit(): void {
    this.modalChangeStrategyNameComponent.onClose = () => {
      this.form
        .get('name')
        ?.setValue(
          this.modalChangeStrategyNameComponent.form.get('strategyName')?.value
        )
    }
    this.breadcrumbsService.update('Início > Estratégias > Criar estratégia')

    this.defineForm()
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.defineEditMode()
    })
  }

  defineForm() {
    this.form = this.formBuilder.group({
      name: ['Minha estratégia'],
      game: ['DOUBLE'],
      platform: ['BLAZE'],

      //Gerenciamento de Risco
      betAmount: [1, [Validators.required, Validators.min(0.1)]],
      skipXCallsAfterYLossOperations: [null],
      skipXCallsAfterYWinOperations: [null],
      skipXGamesAfterYLossOperations: [null],
      skipXGamesAfterYWinOperations: [null],
      waitXMinutesAfterYLossOperations: [null],
      waitXMinutesAfterYWinOperations: [null],

      //Alavancagem
      enableMartingale: [false],
      martingaleMultiplierCount: [2],
      martingaleCustomMultipliers: this.formBuilder.array([]),
      martingaleDoNextCallOnly: [false],
      enableSoros: [false],
      sorosHandCount: [0],
      sorosProfitPercentage: [100],
      sorosDoWithProfitOnly: [false],
      enableSorosgale: [false],
      sorosgaleHandCount: [0],
      sorosgaleMultiplier: [2],

      enableWhiteProtection: [false],
      whiteProtectionBetAmount: [1],
      whiteProtectionDoMartingale: [false],
      whiteProtectionMartingaleMultiplierCount: [2],
      whiteProtectionCustomMultipliers: this.formBuilder.array([]),
    })
  }

  isCurrentTab(tab: string) {
    return tab === this.currentTab
  }

  setCurrentTab(tab: string) {
    this.currentTab = tab
  }

  validateForm() {
    let error = { text: '', title: '' }

    this.form.markAllAsTouched()

    this.applyValidationPlan()

    if (this.form.invalid) {
      error = {
        title: `Erro ao ${this.isEditing ? 'editar' : 'criar'} a estratégia`,
        text: 'Existem campos inválidos',
      }
    }

    const patternsIndicator =
      this.strategyGame === 'CRASH'
        ? this.crashPatternsComponent
        : this.doublePatternsComponent

    const indicatorsToValidate = [patternsIndicator, this.timePatternsComponent]

    if (!indicatorsToValidate.some((indicator) => indicator.validate())) {
      error = {
        title: `Erro ao ${this.isEditing ? 'editar' : 'criar'} a estratégia`,
        text: 'Verifique se existe ao menos um gatilho de entrada.',
      }
    }

    return error.text === '' ? null : error
  }

  editStrategyName() {
    this.modalChangeStrategyNameComponent.openWithParams({
      strategyName: this.strategyName,
    })
  }

  editStrategyGame(game: string) {
    const patterns =
      this.strategyGame === 'CRASH'
        ? this.crashPatternsComponent.patterns
        : this.doublePatternsComponent.patterns

    const control = this.form.get('game')

    if (!control) return

    const hasUnsavedChanges =
      patterns.length > 0 || this.timePatternsComponent.patterns.length > 0

    if (hasUnsavedChanges) {
      this.modalService.open({
        name: 'confirmation',
        data: {
          title: 'Atenção',
          text: 'Você tem certeza que deseja trocar de jogo? você tem alterações que podem ser perdidas.',
          onConfirmation: () => {
            control.setValue(game)

            this.strategyGame === 'CRASH'
              ? this.doublePatternsComponent.resetPatterns()
              : this.crashPatternsComponent.resetPatterns()

            this.timePatternsComponent.resetPatterns()

            this.applyValidationPlan()
          },
        },
      })
    } else {
      control.setValue(game)

      if (this.currentTab === 'time') {
        this.setCurrentTab('patterns')
      }

      this.applyValidationPlan()
    }
  }

  applyValidationPlan() {
    const validationPlan =
      this.platformValidationPlans[this.strategyPlatform as Platform]

    if (validationPlan.common) this.applyValidations(validationPlan.common)

    if (this.strategyGame === 'CRASH' && validationPlan.CRASH)
      this.applyValidations(validationPlan.CRASH)

    if (this.strategyGame === 'DOUBLE' && validationPlan.DOUBLE)
      this.applyValidations(validationPlan.DOUBLE)
  }

  applyValidations(validations: { [key: string]: any }) {
    Object.entries(validations).forEach(([key, validators]) => {
      const control = this.form.get(key)

      if (!control) return

      control.clearValidators()
      control.addValidators(validators)
      control.updateValueAndValidity()
    })
  }

  editStrategyPlatform(platform: string) {
    const control = this.form.get('platform')

    if (!control) return

    control.setValue(platform)

    this.applyValidationPlan()
  }

  getFormControlValue(control: string) {
    return this.form.get(control)?.value
  }

  patchFormControlValue(control: string, value: any) {
    this.form.get(control)?.setValue(value)
  }

  insertIntoStrategyData(key: string) {
    this.strategyData[key] = this.getFormControlValue(key)
  }

  insertRequiredIntoStrategyData(key: string) {
    const control = this.form.get(key)

    if (control && control.hasValidator(Validators.required)) {
      this.strategyData[key] = this.getFormControlValue(key)
    }
  }

  insertRequiredEnabledIntoStrategyData(key: string) {
    const control = this.form.get(key)

    if (control && control.enabled) {
      this.strategyData[key] = this.getFormControlValue(key)
    }
  }

  transformFormValueToStrategyData() {
    this.strategyData = {}

    const data = this.strategyData

    if (this.strategyGame === 'CRASH') {
      if (this.crashPatternsComponent.validate())
        data['crashPatterns'] =
          this.crashPatternsComponent.getPatternsForSubmit()
    }

    if (this.strategyGame === 'DOUBLE') {
      if (this.doublePatternsComponent.validate())
        data['doublePatterns'] =
          this.doublePatternsComponent.getPatternsForSubmit()
    }

    if (this.timePatternsComponent.validate())
      data['timePatterns'] = this.timePatternsComponent.getPatternsForSubmit()
    ;['betAmount'].forEach((controlName) => {
      this.insertRequiredIntoStrategyData(controlName)
    })
    ;[
      'skipXCallsAfterYLossOperations',
      'skipXCallsAfterYWinOperations',
      'skipXGamesAfterYLossOperations',
      'skipXGamesAfterYWinOperations',
      'waitXMinutesAfterYLossOperations',
      'waitXMinutesAfterYWinOperations',
    ].forEach((controlName) => {
      this.insertRequiredEnabledIntoStrategyData(controlName)
    })

    const enableMartingale = this.getFormControlValue('enableMartingale')
    this.insertIntoStrategyData('enableMartingale')

    if (enableMartingale) {
      ;['martingaleMultiplierCount', 'martingaleDoNextCallOnly'].forEach(
        (controlName) => this.insertIntoStrategyData(controlName)
      )

      data['martingaleCustomMultipliers'] = this.getFormControlValue(
        'martingaleCustomMultipliers'
      ).map((value: any) => {
        return Number(value.multiplier)
      }) as number[]
      ;['martingaleMultiplierCount'].forEach((controlName) => {
        data[controlName] = Number(data[controlName])
      })
    }

    const enableSoros = this.getFormControlValue('enableSoros')
    this.insertIntoStrategyData('enableSoros')

    if (enableSoros) {
      ;[
        'sorosHandCount',
        'sorosProfitPercentage',
        'sorosDoWithProfitOnly',
      ].forEach((controlName) => this.insertIntoStrategyData(controlName))
      ;['sorosHandCount', 'sorosProfitPercentage'].forEach((controlName) => {
        data[controlName] = Number(data[controlName])
      })

      data['sorosHandCount'] = Math.floor(data['sorosHandCount'])
    }

    const enableSorosgale = this.getFormControlValue('enableSorosgale')
    this.insertIntoStrategyData('enableSorosgale')

    if (enableSorosgale) {
      ;['sorosgaleHandCount', 'sorosgaleMultiplier'].forEach((controlName) =>
        this.insertIntoStrategyData(controlName)
      )
      ;['sorosgaleHandCount', 'sorosgaleMultiplier'].forEach((controlName) => {
        data[controlName] = Number(data[controlName])
      })

      data['sorosgaleHandCount'] = Math.floor(data['sorosgaleHandCount'])
    }

    const enableWhiteProtection = this.getFormControlValue(
      'enableWhiteProtection'
    )
    this.insertIntoStrategyData('enableWhiteProtection')

    if (enableWhiteProtection) {
      ;['whiteProtectionBetAmount', 'whiteProtectionDoMartingale'].forEach(
        (controlName) => this.insertIntoStrategyData(controlName)
      )
      ;['whiteProtectionBetAmount'].forEach((controlName) => {
        data[controlName] = Number(data[controlName])
      })
      ;['whiteProtectionDoMartingale'].forEach((controlName) => {
        data[controlName] = enableMartingale
          ? data[controlName] === true
          : false
      })

      const enableWhiteProtectionMartingale = this.getFormControlValue(
        'whiteProtectionDoMartingale'
      )

      if (enableWhiteProtectionMartingale && enableMartingale) {
        ;['whiteProtectionMartingaleMultiplierCount'].forEach((controlName) =>
          this.insertIntoStrategyData(controlName)
        )

        data['whiteProtectionCustomMultipliers'] = this.getFormControlValue(
          'whiteProtectionCustomMultipliers'
        ).map((value: any) => {
          return Number(value.multiplier)
        }) as number[]
        ;['whiteProtectionMartingaleMultiplierCount'].forEach((controlName) => {
          data[controlName] = Number(data[controlName])
        })
      }
    }

    return data
  }

  patchFormStrategy(response: GetUserStrategyResponse) {
    const strategy = JSON.parse(response.strategy)
    const inputs = [
      ...this.riskManagementComponent.inputs,
      ...this.leverageComponent.inputs,
    ]

    const { game, name, platform } = response

    this.patchFormControlValue('game', game)
    this.patchFormControlValue('name', name)
    this.patchFormControlValue('platform', platform)

    const excludedControls = [
      'martingaleCustomMultipliers',
      'whiteProtectionCustomMultipliers',
    ]

    Object.keys(this.form.controls)
      .filter((controlKey) => !excludedControls.includes(controlKey))
      .forEach((controlKey) => {
        if (controlKey in strategy) {
          this.patchFormControlValue(controlKey, strategy[controlKey])

          const foundInput = inputs.find(
            (input) => input.name === controlKey && input.requiresActivation
          )

          foundInput && foundInput.toggleActivate()
        }
      })

    if (game === 'CRASH') {
      strategy.crashPatterns &&
        this.crashPatternsComponent.parseAndLoad(strategy.crashPatterns)
    }

    if (game === 'DOUBLE') {
      strategy.doublePatterns &&
        this.doublePatternsComponent.parseAndLoad(strategy.doublePatterns)
    }

    strategy.timePatterns &&
      this.timePatternsComponent.parseAndLoad(strategy.timePatterns)

    if (
      strategy.timePatterns &&
      !strategy.doublePatterns &&
      !strategy.crashPatterns
    ) {
      this.setCurrentTab('time')
    }

    if (strategy.martingaleCustomMultipliers) {
      this.loadMartingaleCustomMultipliers(
        'martingaleCustomMultipliers',
        strategy.martingaleCustomMultipliers
      )

      if (strategy.whiteProtectionCustomMultipliers) {
        this.loadMartingaleCustomMultipliers(
          'whiteProtectionCustomMultipliers',
          strategy.whiteProtectionCustomMultipliers
        )
      }
    }

    this.applyValidationPlan()
  }

  loadMartingaleCustomMultipliers(controlName: string, multipliers: number[]) {
    const control = this.form.get(controlName) as FormArray

    if (control) {
      multipliers.forEach((multiplier: number) => {
        control.push(
          this.formBuilder.group({
            multiplier,
          })
        )
      })
    }
  }

  defineEditMode() {
    this.title.setTitle('Editar estratégia - Shark')

    const strategyId = this.activatedRoute.snapshot.paramMap.get('strategyId')

    if (!strategyId) {
      this.isStrategyLoaded = true
      return
    }

    this.isEditing = true
    this.isEditingId = strategyId

    this.breadcrumbsService.update('Início > Estratégias > Editar Estratégia')
    this.strategyApiService
      .getUserStrategy(strategyId)
      .then((strategy) => {
        this.patchFormStrategy(strategy)
      })
      .finally(() => {
        this.isStrategyLoaded = true
      })
  }

  submitStrategy() {
    const errorMessage = this.validateForm()

    if (errorMessage) {
      this.modalService.open({
        name: 'warning',
        data: errorMessage,
      })
      return
    }

    const strategyData = this.transformFormValueToStrategyData()

    const formData = {
      name: this.getFormControlValue('name'),
      game: this.getFormControlValue('game'),
      platform: this.getFormControlValue('platform'),
      strategy: JSON.stringify(strategyData),
    }

    const apiCall = this.isEditing
      ? this.strategyApiService.updateUserStrategy({
          id: this.isEditingId,
          ...formData,
        })
      : this.strategyApiService.createUserStrategy(formData)

    apiCall
      .then(() => {
        this.modalService.open({
          name: 'success',
          data: {
            text: `Estratégia ${
              this.isEditing ? 'editada' : 'criada'
            } com sucesso`,
            onClose: () => {
              this.router.navigate(['strategies'])
            },
          },
        })
      })
      .catch(() => {
        this.modalService.open({
          name: 'warning',
          data: {
            title: 'Erro',
            text: `Não foi possível ${
              this.isEditing ? 'editar' : 'criar'
            } a estratégia`,
          },
        })
      })
  }

  canShowShimmer(): boolean {
    return !this.isStrategyLoaded
  }

  isLoaded(): boolean {
    return !this.isEditing || this.isStrategyLoaded
  }
}
