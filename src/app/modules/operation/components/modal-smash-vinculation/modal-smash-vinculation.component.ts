import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  fadeInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
} from 'angular-animations';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { UserApiService } from './../../../user/services/user-api/user-api.service';

@Component({
  selector: 'app-modal-smash-vinculation',
  templateUrl: './modal-smash-vinculation.component.html',
  styleUrls: ['./modal-smash-vinculation.component.sass'],
  animations: [
    fadeInOnEnterAnimation({ duration: 400 }),
    fadeOutOnLeaveAnimation({ duration: 400 }),
  ],
})
export class ModalSmashVinculationComponent
  extends ModalComponent<void>
  implements OnInit
{
  isErrored = false;

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userApiService: UserApiService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nickname: ['', Validators.required],
    });

    this.form.valueChanges.subscribe(() => {
      this.toggleError(false);
    });
  }

  toggleError(toggle: boolean) {
    this.isErrored = toggle;
  }

  async onFormSubmit() {
    if (this.form.invalid) return;

    let formData = this.form.getRawValue();

    try {
      await this.userApiService.vinculatePlatform('SMASH', formData.nickname);

      this.close();
    } catch {
      this.toggleError(true);
    }
  }
}
