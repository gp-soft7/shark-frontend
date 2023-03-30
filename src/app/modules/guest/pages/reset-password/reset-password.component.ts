import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthApiService } from '../../../../core/services/auth-api/auth-api.service';
import { apiError } from '../../../../shared/helpers/functions/api-error.helper';
import { ModalService } from './../../../../shared/services/modal.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.sass'],
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  isErrored = false;
  errorMessage = '';

  isSuccessful = false;

  constructor(
    private formBuilder: FormBuilder,
    private authApiService: AuthApiService,
    private router: Router,
    private title: Title,
    private activatedRoute: ActivatedRoute,
    public modalService: ModalService
  ) {
    this.title.setTitle('Esqueci minha senha - Shark');
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', [Validators.required, Validators.minLength(8)]],
    });

    this.form.valueChanges.subscribe((values) => {
      this.updateError(false);

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

  updateError(toggle: boolean, message: string = '') {
    this.isErrored = toggle;
    this.errorMessage = message;
  }

  submit() {
    this.updateError(false);
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    const { password } = this.form.getRawValue();
    const token = this.activatedRoute.snapshot.paramMap.get('token');

    if (!token) return;

    this.authApiService
      .resetPassword(token, password)
      .then(() => {
        this.isSuccessful = true;
      })
      .catch((error) => {
        if (apiError(error, 'TOKEN_EXPIRED')) {
          this.updateError(
            true,
            'Não foi possível redefinir a senha. O token foi expirado.'
          );
        } else if (apiError(error, 'NOT_FOUND')) {
          this.updateError(
            true,
            'Não foi possível redefinir a senha. Token inválido.'
          );
        } else {
          this.updateError(true, 'Não foi possível redefinir a senha.');
        }
      });
  }

  redirectToLogin() {
    this.router.navigate(['/signin']);
  }
}
