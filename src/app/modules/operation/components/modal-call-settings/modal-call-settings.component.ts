import { Component, OnInit } from '@angular/core'
import {
  fadeInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
} from 'angular-animations'
import { ModalComponent } from '../../../../shared/components/modal/modal.component'
import { CallCardStyle } from '../call-card/call-card.component.types'
import { CallSettingsService } from './../../services/call-settings/call-settings.service'

@Component({
  selector: 'app-modal-call-settings',
  templateUrl: './modal-call-settings.component.html',
  styleUrls: ['./modal-call-settings.component.sass'],
  animations: [
    fadeInOnEnterAnimation({ duration: 400 }),
    fadeOutOnLeaveAnimation({ duration: 400 }),
  ],
})
export class ModalCallSettingsComponent extends ModalComponent<void> {
  constructor(private callSettingsService: CallSettingsService) {
    super()
  }

  get current() {
    return this.callSettingsService.current
  }

  override onClose(component: ModalComponent<void>): void {
    this.callSettingsService.save()
  }
}
