import { Component } from '@angular/core';
import {
  fadeInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
} from 'angular-animations';
import { ModalComponent } from '../modal.component';
import { ModalConfirmationParams } from './modal-confirmation.component.types';

@Component({
  selector: 'app-modal-confirmation',
  templateUrl: './modal-confirmation.component.html',
  styleUrls: ['./modal-confirmation.component.sass'],
  animations: [
    fadeInOnEnterAnimation({ duration: 400 }),
    fadeOutOnLeaveAnimation({ duration: 400 }),
  ],
})
export class ModalConfirmationComponent extends ModalComponent<ModalConfirmationParams> {
  confirm() {
    this.params.onConfirmation();

    this.close();
  }
}
