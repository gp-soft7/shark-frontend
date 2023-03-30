import { Component, OnInit } from '@angular/core';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BlazeConnectionService } from '../../services/blaze-connection/blaze-connection.service';
import {
  fadeInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
} from 'angular-animations';

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
  extends ModalComponent<void>
  implements OnInit
{
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private blazeConnectionService: BlazeConnectionService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      accessToken: ['', Validators.required],
    });

    this.form.valueChanges.subscribe(() => {
      this.toggleError(false);
    });
  }

  toggleError(toggle: boolean) {
    const control = this.form.get('accessToken');

    if (!toggle) {
      control?.setErrors(null);
      return;
    }

    control?.setErrors({
      invalidAccessToken: toggle,
    });
  }

  onFormSubmit() {
    if (this.form.invalid) return;

    let formData = this.form.getRawValue();
    let rawAccessToken = formData['accessToken'] as string;
    rawAccessToken = rawAccessToken.replace(/'/g, '').replace(/"/g, '');

    const rawAccessTokenParts = rawAccessToken.split(';');

    if (rawAccessTokenParts.length !== 2) {
      this.toggleError(true);
      return;
    }

    const [accessToken, walletId] = rawAccessTokenParts;

    if (isNaN(walletId as any)) {
      this.toggleError(true);
      return;
    }

    try {
      this.blazeConnectionService.connect(accessToken, walletId);

      this.close();
    } catch {
      this.toggleError(true);
    }
  }
}
