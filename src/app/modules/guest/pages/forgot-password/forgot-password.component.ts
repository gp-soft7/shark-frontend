import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthApiService } from '../../../../core/services/auth-api/auth-api.service';
import { apiError } from './../../../../shared/helpers/functions/api-error.helper';
import { ModalService } from './../../../../shared/services/modal.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.sass'],
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;
  isErrored = false;
  errorMessage = '';

  isSuccessful = false;

  constructor(
    private formBuilder: FormBuilder,
    private authApiService: AuthApiService,
    private router: Router,
    private title: Title,
    public modalService: ModalService
  ) {
    this.title.setTitle('Esqueci minha senha - Shark');
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.form.valueChanges.subscribe(() => {
      this.updateError(false);
    });
  }

  updateError(toggle: boolean, message: string = '') {
    this.isErrored = toggle;
    this.errorMessage = message;
  }

  submit() {
    this.updateError(false);
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    const { email } = this.form.getRawValue();

    this.authApiService
      .forgotPassword(email)
      .then(() => {
        this.isSuccessful = true;
      })
      .catch((error) => {
        if (apiError(error, 'ALREADY_EXISTS')) {
          this.updateError(
            true,
            'Já foi enviado um email para redefinição de senha. Tente novamente mais tarde.'
          );
        }
      });
  }

  redirectToLogin() {
    this.router.navigate(['/signin']);
  }
}
