import { Component, OnInit } from '@angular/core';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalChangeStrategyNameParams } from './modal-change-strategy-name.component.types';
import {
  fadeInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
} from 'angular-animations';

@Component({
  selector: 'app-modal-change-strategy-name',
  templateUrl: './modal-change-strategy-name.component.html',
  styleUrls: ['./modal-change-strategy-name.component.sass'],
  animations: [
    fadeInOnEnterAnimation({ duration: 400 }),
    fadeOutOnLeaveAnimation({ duration: 400 }),
  ],
})
export class ModalChangeStrategyNameComponent
  extends ModalComponent<ModalChangeStrategyNameParams>
  implements OnInit
{
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      strategyName: ['', Validators.required],
    });
  }

  override onOpen(): void {
    this.form.patchValue({ strategyName: this.params.strategyName });

    setTimeout(() => {
      const selectedInput: HTMLElement = <HTMLElement>(
        document.querySelector('input[name="strategyName"]')
      );

      selectedInput.focus();
    });
  }
}
