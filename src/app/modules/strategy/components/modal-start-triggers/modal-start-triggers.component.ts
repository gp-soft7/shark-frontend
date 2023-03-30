import { Component, OnInit } from '@angular/core';
import {
  fadeInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
} from 'angular-animations';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-modal-start-triggers',
  templateUrl: './modal-start-triggers.component.html',
  styleUrls: ['./modal-start-triggers.component.sass'],
  animations: [
    fadeInOnEnterAnimation({ duration: 400 }),
    fadeOutOnLeaveAnimation({ duration: 400 }),
  ],
})
export class ModalStartTriggersComponent
  extends ModalComponent<void>
  implements OnInit
{
  ngOnInit(): void {
    // this.open();
  }
}
