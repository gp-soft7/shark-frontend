import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { BreadcrumbsService } from './../../../../shared/services/breadcrumbs.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppValidators } from '../../../../core/validators/index.validators';
import { RiskManagementApiService } from '../../services/risk-management-api/risk-managent-api.service';
import { ModalService } from './../../../../shared/services/modal.service';
import { InputComponent } from '../../../../shared/components/input/input.component';

@Component({
  selector: 'app-risk-management',
  templateUrl: './risk-management.component.html',
  styleUrls: ['./risk-management.component.sass'],
})
export class RiskManagementComponent implements OnInit {
  form: FormGroup;
  formActivationValidations = {
    dailyProfitGoal: [AppValidators.number, Validators.min(2)],
    dailyMaxProfitOperations: [AppValidators.number, Validators.min(1)],
    dailyLossLimit: [AppValidators.number, Validators.min(2)],
    dailyMaxLossOperations: [AppValidators.number, Validators.min(1)],
  };

  riskManagementData: any = {};

  @ViewChildren(InputComponent)
  inputs: QueryList<InputComponent>;

  constructor(
    private breadcrumbsService: BreadcrumbsService,
    private formBuilder: FormBuilder,
    private riskManagementApiService: RiskManagementApiService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.breadcrumbsService.update('Início > Gerenciamento de Risco');

    this.defineForm();
    this.loadRiskManagement();
  }

  defineForm() {
    this.form = this.formBuilder.group({
      dailyProfitGoal: [2],
      dailyMaxProfitOperations: [],
      dailyLossLimit: [0],
      dailyMaxLossOperations: [],
    });
  }

  insertRequiredIntoRiskManagementData(key: string) {
    const control = this.form.get(key);

    if (control && control.hasValidator(Validators.required)) {
      this.riskManagementData[key] = Number(this.getFormControlValue(key));
    }
  }

  getFormControlValue(control: string) {
    return this.form.get(control)?.value;
  }

  patchFormControlValue(control: string, value: any) {
    this.form.get(control)?.setValue(value);
  }

  loadRiskManagement() {
    this.riskManagementApiService
      .getRiskManagement()
      .then(({ riskManagement }: any) => {
        const data = JSON.parse(riskManagement);

        Object.keys(data).forEach((controlKey: string) => {
          this.patchFormControlValue(controlKey, data[controlKey]);

          const foundInput = this.inputs.find(
            (input) =>
              input.name === controlKey && input.requiresActivation === true
          );

          foundInput && foundInput.toggleActivate();
        });
      });
  }

  submitRiskManagement() {
    this.riskManagementData = {};
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.modalService.open({
        name: 'warning',
        data: {
          title: 'Erro ao salvar',
          text: 'Existem campos inválidos',
        },
      });
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

    ['dailyLossLimit', 'dailyMaxLossOperations'].forEach((controlName) => {
      if (this.riskManagementData.hasOwnProperty(controlName)) {
        this.riskManagementData[controlName] = Number(
          this.riskManagementData[controlName]
        );
      }
    });

    this.riskManagementApiService
      .createRiskManagement({
        riskManagement: JSON.stringify(this.riskManagementData),
      })
      .then(() => {
        this.modalService.open({
          name: 'success',
          data: {
            text: 'Gerenciamento de risco salvo com sucesso!',
          },
        });
      })
      .catch(() => {
        this.modalService.open({
          name: 'warning',
          data: {
            title: 'Ocorreu um erro',
            text: 'Não foi possível salvar o gerenciamento de risco.',
          },
        });
      });
  }
}
