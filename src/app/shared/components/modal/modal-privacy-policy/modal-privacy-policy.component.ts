import { Component } from '@angular/core';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';
import { ModalComponent } from '../modal.component';

@Component({
  selector: 'app-modal-privacy-policy',
  templateUrl: './modal-privacy-policy.component.html',
  styleUrls: ['./modal-privacy-policy.component.sass'],
  animations: [
    fadeInOnEnterAnimation({ duration: 400 }),
    fadeOutOnLeaveAnimation({ duration: 400 }),
  ],
})
export class ModalPrivacyPolicyComponent extends ModalComponent<void> {}
