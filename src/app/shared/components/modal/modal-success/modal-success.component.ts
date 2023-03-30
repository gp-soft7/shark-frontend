import { Component } from '@angular/core';
import {
  fadeInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
} from 'angular-animations';
import { ModalComponent } from '../modal.component';
import { ModalCommonParams } from '../modal.component.types';

@Component({
  selector: 'app-modal-success',
  templateUrl: './modal-success.component.html',
  styleUrls: ['./modal-success.component.sass'],
  animations: [
    fadeInOnEnterAnimation({ duration: 400 }),
    fadeOutOnLeaveAnimation({ duration: 400 }),
  ],
})
export class ModalSuccessComponent extends ModalComponent<ModalCommonParams> {
  override onClose(component: ModalComponent<ModalCommonParams>): void {
    this.params.onClose && this.params.onClose();
  }
}
