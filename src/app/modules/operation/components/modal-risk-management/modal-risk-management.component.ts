import {
  Component,
  OnInit,
  QueryList,
  ViewChildren,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  fadeInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
} from 'angular-animations';
import { AppValidators } from '../../../../core/validators/index.validators';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { RiskManagementApiService } from '../../services/risk-management-api/risk-managent-api.service';
import { ShimmerLoaded } from './../../../../shared/misc/shimmer-loaded';
import { TimeRestrictionsComponent } from './../time-restrictions/time-restrictions.component';

@Component({
  selector: 'app-modal-risk-management',
  templateUrl: './modal-risk-management.component.html',
  styleUrls: ['./modal-risk-management.component.sass'],
  animations: [
    fadeInOnEnterAnimation({ duration: 400 }),
    fadeOutOnLeaveAnimation({ duration: 400 }),
  ],
})
export class ModalRiskManagementComponent
  extends ModalComponent<void>
  implements OnInit, ShimmerLoaded
{
  form: FormGroup;
  formActivationValidations = {
    dailyProfitGoal: [AppValidators.number, Validators.min(0.10)],
    dailyMaxProfitOperations: [AppValidators.number, Validators.min(1)],
    dailyLossLimit: [AppValidators.number, Validators.min(0.10)],
    dailyMaxLossOperations: [AppValidators.number, Validators.min(1)],
  };
  riskManagementData: any = {};
  isDataLoaded = false;

  @ViewChildren(InputComponent)
  inputs: QueryList<InputComponent>;

  @ViewChild('timeRestrictions')
  timeRestrictionsComponent: TimeRestrictionsComponent;

  constructor(
    private formBuilder: FormBuilder,
    private riskManagementApiService: RiskManagementApiService
  ) {
    super();
  }

  canShowShimmer() {
    return !this.isDataLoaded;
  }

  isLoaded() {
    return this.isDataLoaded;
  }

  ngOnInit(): void {
    this.defineForm();
  }

  override onOpen(): void {
    this.loadRiskManagement();
  }

  defineForm() {
    this.form = this.formBuilder.group({
      dailyProfitGoal: [2],
      dailyMaxProfitOperations: [],
      dailyLossLimit: [0],
      dailyMaxLossOperations: [],
      restartOnNextDay: [false],
    });
  }

  loadRiskManagement() {
    this.isDataLoaded = false;

    setTimeout(() => {
      this.riskManagementApiService
        .getRiskManagement()
        .then((riskManagement: any) => {
          const data = JSON.parse(riskManagement);

          Object.keys(data).forEach((controlKey: string) => {
            this.patchFormControlValue(controlKey, data[controlKey]);

            const foundInput = this.inputs.find(
              (input) =>
                input.name === controlKey && input.requiresActivation === true
            );

            foundInput && foundInput.toggleActivate();
          });

          if (data.timeRestrictions) {
            this.timeRestrictionsComponent.loadData(data.timeRestrictions);
          }
        })
        .finally(() => {
          this.isDataLoaded = true;
        });
    });
  }

  getFormControlValue(control: string) {
    return this.form.get(control)?.value;
  }

  patchFormControlValue(control: string, value: any) {
    this.form.get(control)?.setValue(value);
  }

  insertRequiredIntoRiskManagementData(key: string) {
    const control = this.form.get(key);

    if (control && control.hasValidator(Validators.required)) {
      this.riskManagementData[key] = Number(this.getFormControlValue(key));
    }
  }

  insertIntoRiskManagementData(key: string) {
    this.riskManagementData[key] = this.getFormControlValue(key);
  }

  submitRiskManagement() {
    this.riskManagementData = {};
    this.form.markAllAsTouched();

    if (this.form.invalid || this.timeRestrictionsComponent.invalid) {
      return;
    }

    [
      'dailyProfitGoal',
      'dailyMaxProfitOperations',
      'dailyLossLimit',
      'dailyMaxLossOperations',
    ].forEach((controlName) => {
      this.insertRequiredIntoRiskManagementData(controlName);
    });

    this.insertIntoRiskManagementData('restartOnNextDay');

    ['dailyLossLimit', 'dailyMaxLossOperations'].forEach((controlName) => {
      if (this.riskManagementData.hasOwnProperty(controlName)) {
        this.riskManagementData[controlName] = Number(
          this.riskManagementData[controlName]
        );
      }
    });

    if (this.timeRestrictionsComponent.isFilled) {
      this.riskManagementData['timeRestrictions'] =
        this.timeRestrictionsComponent.getDataForSubmit();
    }

    const jsonRiskManagement = JSON.stringify(this.riskManagementData);

    this.riskManagementApiService
      .createRiskManagement({
        riskManagement: jsonRiskManagement,
      })
      .finally(() => {
        this.riskManagementApiService.updateRiskManagementCache(
          jsonRiskManagement
        );
        this.close();
      });
  }
}
