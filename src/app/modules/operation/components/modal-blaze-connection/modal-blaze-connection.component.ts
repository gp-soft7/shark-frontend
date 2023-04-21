import { Component, OnInit } from '@angular/core'
import { ModalComponent } from '../../../../shared/components/modal/modal.component'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import {
  fadeInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
} from 'angular-animations'
import {
  ModalPlatformConnectionParams,
  ModalPlatformConnectionDefinitions,
} from './modal-blaze-connection.component.types'
import { PlatformConnectionService } from '../../services/platform-connection/platform-connection.service'

@Component({
  selector: 'app-modal-blaze-connection',
  templateUrl: './modal-blaze-connection.component.html',
  styleUrls: ['./modal-blaze-connection.component.sass'],
  animations: [
    fadeInOnEnterAnimation({ duration: 400 }),
    fadeOutOnLeaveAnimation({ duration: 400 }),
  ],
})
export class ModalBlazeConnectionComponent
  extends ModalComponent<ModalPlatformConnectionParams>
  implements OnInit
{
  form: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private platformConnectionService: PlatformConnectionService
  ) {
    super()
  }

  ngOnInit(): void {
    if (this.form)
      this.form.valueChanges.subscribe(() => {
        this.toggleError(false)
      })
  }

  override onOpen(): void {
    this.form = this.formBuilder.group({
      accessToken: ['', Validators.required],
    })
  }

  get definition() {
    return ModalPlatformConnectionDefinitions[this.params.platform]
  }

  toggleError(toggle: boolean) {
    const control = this.form.get('accessToken')

    if (!toggle) {
      control?.setErrors(null)
      return
    }

    control?.setErrors({
      invalidAccessToken: toggle,
    })
  }

  onFormSubmit() {
    if (this.form.invalid) return

    let formData = this.form.getRawValue()

    const accessToken = formData['accessToken']
      .replace(/'/g, '')
      .replace(/"/g, '')
      .trim()

    if (!this.definition.validate(accessToken)) {
      this.toggleError(true)
      return
    }

    this.platformConnectionService.connect(this.params.platform, accessToken)

    this.close()
  }
}
