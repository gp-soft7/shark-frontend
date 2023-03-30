import { Component, OnInit } from '@angular/core';
import {
  fadeInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
} from 'angular-animations';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { ModalCommonParams } from '../../../../shared/components/modal/modal.component.types';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthApiService } from './../../../../core/services/auth-api/auth-api.service';

@Component({
  selector: 'app-modal-change-password',
  templateUrl: './modal-change-password.component.html',
  styleUrls: ['./modal-change-password.component.sass'],
  animations: [
    fadeInOnEnterAnimation({ duration: 300 }),
    fadeOutOnLeaveAnimation({ duration: 300 }),
  ],
})
export class ModalChangePasswordComponent
  extends ModalComponent<ModalCommonParams>
  implements OnInit
{
  form: FormGroup;
  isErrored = false;

  constructor(
    private formBuilder: FormBuilder,
    private authApiService: AuthApiService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', [Validators.required, Validators.minLength(8)]],
    });

    this.form.valueChanges.subscribe((values) => {
      this.clearError();

      const { password, password2 } = values;

      const password2Control = this.form.get('password2');

      if (!password2Control) return;

      if (password2Control.dirty) {
        password2Control.setErrors(
          password !== password2
            ? {
                invalidPasswordConfirmation: true,
              }
            : null,
          { emitEvent: true }
        );
      }
    });
  }

  override onOpen(): void {
    this.form && this.form.reset();
  }

  clearError() {
    this.isErrored = false;
  }

  submit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    const { oldPassword, password } = this.form.getRawValue();

    this.authApiService
      .changePassword(oldPassword, password)
      .then(() => {
        this.close();
      })
      .catch(() => {
        this.isErrored = true;
      });
  }
}
