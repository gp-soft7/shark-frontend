import {
  Component,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { AppValidators } from '../../../../core/validators/index.validators';
import { InputComponent } from '../../../../shared/components/input/input.component';

@Component({
  selector: 'app-leverage',
  templateUrl: './leverage.component.html',
  styleUrls: ['./leverage.component.sass'],
})
export class LeverageComponent implements OnInit {
  @Input()
  form: FormGroup;

  formActivationValidations = {
    //Alavancagem
    martingaleMultiplierCount: [
      AppValidators.number,
      Validators.min(1),
      Validators.max(100),
    ],
    sorosHandCount: [AppValidators.number, Validators.min(1)],
    sorosProfitPercentage: [
      AppValidators.number,
      Validators.min(1),
      Validators.max(100),
    ],
    sorosgaleHandCount: [AppValidators.number, Validators.min(1)],
    sorosgaleMultiplier: [AppValidators.number, Validators.min(0.01)],
  };

  @ViewChildren(InputComponent)
  inputs: QueryList<InputComponent>;

  getFormControlValue(control: string) {
    return this.form.get(control)?.value;
  }

  get minimumWallet() {
    const betAmount = Number(this.getFormControlValue('betAmount'));
    const sorosHandCount = Number(this.getFormControlValue('sorosHandCount'));
    const sorosProfitPercentage = Number(
      this.getFormControlValue('sorosProfitPercentage')
    );
    const sorosgaleMultiplier = Number(
      this.getFormControlValue('sorosgaleMultiplier')
    );
    const sorosgaleHandCount = Number(
      this.getFormControlValue('sorosgaleHandCount')
    );

    let bets: number[] = [betAmount];

    const reducer = (previous: number, current: number) => current + previous;

    const applyMartingales = (initialBet: number) => {
      const result = [initialBet];

      this.martingaleCustomMultipliers.value.forEach(
        (customMultiplier: any) => {
          result.push(result[result.length - 1] * customMultiplier.multiplier);
        }
      );

      return result;
    };

    if (this.isMartingaleEnabled) {
      bets = applyMartingales(betAmount);
    }

    if (this.isSorosgaleEnabled) {
      let lastBetIndex = bets[bets.length - 1];

      if (this.isMartingaleEnabled) {
        for (let i = 0; i < sorosgaleHandCount; i++) {
          const martingaleBets = applyMartingales(
            lastBetIndex * sorosgaleMultiplier
          );

          lastBetIndex = bets[bets.length - 1];

          bets.push(...martingaleBets);
        }
      } else {
        for (let i = 0; i < sorosgaleHandCount; i++) {
          bets.push(lastBetIndex * sorosgaleMultiplier);

          lastBetIndex = bets[bets.length - 1];
        }
      }
    }

    if (this.isSorosEnabled) {
      const realSorosProfitPercentage = sorosProfitPercentage / 100;
      const betsToAdd: number[] = [];

      for (let i = 0; i < sorosHandCount; i++) {
        for (let j = 0; j < bets.length; j++) {
          betsToAdd.push(bets[j] * ((realSorosProfitPercentage + 1) * (i + 1)));
        }
      }

      bets = bets.concat(betsToAdd);
    }

    return bets.reduce(reducer, 0);
  }

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(50))
      .subscribe(() => {
        this.toggleMartingaleControls();
        this.toggleSorosControls();
        this.toggleSorosgaleControls();
      });
  }

  get isMartingaleEnabled() {
    return this.form.get('enableMartingale')?.value;
  }

  get isSorosEnabled() {
    return this.form.get('enableSoros')?.value;
  }

  get isSorosgaleEnabled() {
    return this.form.get('enableSorosgale')?.value;
  }

  get martingaleCustomMultipliers() {
    return this.form.get('martingaleCustomMultipliers') as FormArray;
  }

  addMartingaleCustomMultiplier(multiplier = 2) {
    this.martingaleCustomMultipliers.push(
      this.formBuilder.group({
        multiplier: [multiplier],
      })
    );
  }

  removeMartingaleCustomMultiplier(index: number) {
    this.martingaleCustomMultipliers.removeAt(index);
  }

  toggleControls(controlNames: string[], toggle: boolean) {
    controlNames.forEach((controlName) => {
      const control = this.form.get(controlName);

      if (!control) return;

      const formActivationValidations = (this.formActivationValidations as any)[
        controlName
      ];

      const validatorsToAdd = [
        Validators.required,
        ...formActivationValidations,
      ];

      toggle
        ? control.addValidators(validatorsToAdd)
        : control.clearValidators();

      control.updateValueAndValidity({ emitEvent: false });
    });
  }

  toggleMartingaleControls() {
    this.toggleControls(
      ['martingaleMultiplierCount'],
      this.isMartingaleEnabled
    );

    this.martingaleCustomMultipliers.controls.forEach((group) => {
      const control = group.get('multiplier');

      if (!control) return;

      if (this.isMartingaleEnabled) {
        control.addValidators([Validators.required, AppValidators.number]);
      } else {
        control.clearValidators();
      }
    });

    this.martingaleCustomMultipliers.updateValueAndValidity({
      emitEvent: false,
    });
  }

  toggleSorosControls() {
    this.toggleControls(
      ['sorosHandCount', 'sorosProfitPercentage'],
      this.isSorosEnabled
    );
  }

  toggleSorosgaleControls() {
    this.toggleControls(
      ['sorosgaleHandCount', 'sorosgaleMultiplier'],
      this.isSorosgaleEnabled
    );
  }
}
