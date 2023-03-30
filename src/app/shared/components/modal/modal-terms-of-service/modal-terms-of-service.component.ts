import { Component } from '@angular/core';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';
import { ModalComponent } from '../modal.component';

@Component({
  selector: 'app-modal-terms-of-service',
  templateUrl: './modal-terms-of-service.component.html',
  styleUrls: ['./modal-terms-of-service.component.sass'],
  animations: [
    fadeInOnEnterAnimation({ duration: 400 }),
    fadeOutOnLeaveAnimation({ duration: 400 }),
  ],
})
export class ModalTermsOfServiceComponent extends ModalComponent<void> {}
