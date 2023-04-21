import {
  Component,
  Input,
  QueryList,
  ViewChildren,
  OnInit,
} from '@angular/core'
import { FormArray, FormGroup, Validators } from '@angular/forms'
import { AppValidators } from '../../../../core/validators/index.validators'
import { InputComponent } from '../../../../shared/components/input/input.component'
import { debounceTime, distinctUntilChanged } from 'rxjs'

@Component({
  selector: 'app-risk-management',
  templateUrl: './risk-management.component.html',
  styleUrls: ['./risk-management.component.sass'],
})
export class RiskManagementComponent implements OnInit {
  formActivationValidations = {
    dailyProfitGoal: [AppValidators.number, Validators.min(2)],
    dailyMaxProfitOperations: [AppValidators.number, Validators.min(1)],
    dailyLossLimit: [AppValidators.number, Validators.min(2)],
    dailyMaxLossOperations: [AppValidators.number, Validators.min(1)],
    skipXCallsAfterYLossOperations: [
      AppValidators.complete(AppValidators.number),
      AppValidators.complete(Validators.min(1)),
    ],
    skipXCallsAfterYWinOperations: [
      AppValidators.complete(AppValidators.number),
      AppValidators.complete(Validators.min(1)),
    ],
    skipXGamesAfterYLossOperations: [
      AppValidators.complete(AppValidators.number),
      AppValidators.complete(Validators.min(1)),
    ],
    skipXGamesAfterYWinOperations: [
      AppValidators.complete(AppValidators.number),
      AppValidators.complete(Validators.min(1)),
    ],
    waitXMinutesAfterYLossOperations: [
      AppValidators.complete(AppValidators.number),
      AppValidators.complete(Validators.min(1)),
    ],
    waitXMinutesAfterYWinOperations: [
      AppValidators.complete(AppValidators.number),
      AppValidators.complete(Validators.min(1)),
    ],
    whiteProtectionBetAmount: [],
    whiteProtectionMartingaleMultiplierCount: [
      AppValidators.number,
      Validators.min(1),
    ],
  }

  @Input()
  form: FormGroup

  @ViewChildren(InputComponent)
  inputs: QueryList<InputComponent>

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(50))
      .subscribe(() => {
        this.toggleWhiteProtectionControls()
      })
  }

  get currentGame() {
    return this.form.get('game')?.value
  }

  get isWhiteProtectionEnabled() {
    return this.form.get('enableWhiteProtection')?.value
  }

  get isMartingaleEnabled() {
    return this.form.get('enableMartingale')?.value
  }

  get isWhiteProtectionMartingaleEnabled() {
    return this.form.get('whiteProtectionDoMartingale')?.value
  }

  get whiteProtectionMartingaleCustomMultipliers() {
    return this.form.get('whiteProtectionCustomMultipliers') as FormArray
  }

  get martingaleMultiplierCount() {
    return this.form.get('martingaleMultiplierCount')?.value ?? 2
  }

  toggleControls(controlNames: string[], toggle: boolean) {
    controlNames.forEach((controlName) => {
      const control = this.form.get(controlName)

      if (!control) return

      const formActivationValidations = (this.formActivationValidations as any)[
        controlName
      ]

      const validatorsToAdd = [
        Validators.required,
        ...formActivationValidations,
      ]

      toggle
        ? control.addValidators(validatorsToAdd)
        : control.clearValidators()

      control.updateValueAndValidity({ emitEvent: false })
    })
  }

  toggleWhiteProtectionControls() {
    if (this.isWhiteProtectionMartingaleEnabled) {
      const currentMartingaleCount = this.form.get(
        'martingaleMultiplierCount'
      )?.value

      if (!currentMartingaleCount) return

      const control = this.form.get('whiteProtectionMartingaleMultiplierCount')

      if (!control) return

      control.clearValidators()
      control.addValidators([Validators.max(Number(currentMartingaleCount))])
      control.updateValueAndValidity({ emitEvent: true })
    }

    this.toggleControls(
      ['whiteProtectionBetAmount', 'whiteProtectionMartingaleMultiplierCount'],
      this.isWhiteProtectionEnabled
    )

    this.whiteProtectionMartingaleCustomMultipliers.controls.forEach(
      (group) => {
        const control = group.get('multiplier')

        if (!control) return

        if (this.isWhiteProtectionMartingaleEnabled) {
          control.addValidators([Validators.required, AppValidators.number])
        } else {
          control.clearValidators()
        }
      }
    )

    this.whiteProtectionMartingaleCustomMultipliers.updateValueAndValidity({
      emitEvent: false,
    })
  }
}
