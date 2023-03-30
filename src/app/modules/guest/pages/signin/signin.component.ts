import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthApiService } from './../../../../core/services/auth-api/auth-api.service';
import { TokenService } from './../../../../core/services/token.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AppValidators } from './../../../../core/validators/index.validators';
import { apiError } from './../../../../shared/helpers/functions/api-error.helper';
import { UserApiService } from './../../../user/services/user-api/user-api.service';
import { TitleCasePipe } from '@angular/common';
import { ResponsitivyService } from './../../../../shared/services/responsivity.service';
import { ModalService } from './../../../../shared/services/modal.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.sass'],
})
export class SigninComponent implements OnInit {
  signInForm: FormGroup;
  verifyEmailForm: FormGroup;
  completeSignUpForm: FormGroup;

  isErrored = false;
  errorMessage = '';

  step = 'VERIFY_EMAIL';

  constructor(
    private formBuilder: FormBuilder,
    private authApiService: AuthApiService,
    private userApiService: UserApiService,
    private tokenService: TokenService,
    private router: Router,
    private title: Title,
    private titleCasePipe: TitleCasePipe,
    public responsitivy: ResponsitivyService,
    public modalService: ModalService
  ) {
    this.title.setTitle('Fazer login - Shark');
  }

  ngOnInit(): void {
    this.defineForms();
  }

  defineForms() {
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.verifyEmailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.completeSignUpForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(255)]],
      lastName: ['', [Validators.required, Validators.maxLength(255)]],
      cpf: ['', [Validators.required, AppValidators.cpf]],
      birthDate: ['', [Validators.required, AppValidators.dateString]],
      cellphone: ['', [Validators.required, AppValidators.phone]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', [Validators.required, Validators.minLength(8)]],
    });

    [this.signInForm, this.verifyEmailForm, this.completeSignUpForm].forEach(
      (form) =>
        form.valueChanges.subscribe(() => {
          this.updateError(false);
        })
    );

    this.completeSignUpForm.valueChanges.subscribe((values) => {
      const { password, password2 } = values;

      const password2Control = this.completeSignUpForm.get('password2');

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

  verifyEmail() {
    this.updateError(false);
    this.verifyEmailForm.markAllAsTouched();

    if (this.verifyEmailForm.invalid) return;

    const { email } = this.verifyEmailForm.getRawValue();

    this.authApiService
      .verifyEmail(email)
      .then(() => {
        this.step = 'SIGN_IN';

        setTimeout(() => {
          this.signInForm.get('email')?.setValue(email);

          this.focusInput('input[name="password"]');
        });
      })
      .catch((error) => {
        if (apiError(error, 'USER_INCOMPLETE')) {
          this.step = 'COMPLETE_SIGN_UP';
          this.title.setTitle('Complete seu registro - Shark');

          setTimeout(() => {
            this.focusInput('input[name="firstName"]');
          });
        } else {
          this.updateError(true, 'Não há nenhuma conta com esse email');
        }
      });
  }

  focusInput(selector: string) {
    const selectedInput: HTMLElement = <HTMLElement>(
      document.querySelector(selector)
    );

    selectedInput.focus();
  }

  signIn() {
    this.updateError(false);
    this.signInForm.markAllAsTouched();

    if (this.signInForm.invalid) return;

    const { email, password } = this.signInForm.getRawValue();

    this.doSignIn(email, password);
  }

  doSignIn(email: string, password: string) {
    this.authApiService
      .signIn(email, password)
      .then((data) => {
        this.tokenService.jwtToken = data.accessToken;
        this.tokenService.jwtRefreshToken = data.refreshToken;

        this.router.navigate(['']);
      })
      .catch(() => {
        this.updateError(true, 'Não foi possível fazer login');
      });
  }

  transformBirthDate(date: string) {
    const [day, month, year] = date.split('/');

    return `${year}-${month}-${day}`;
  }

  completeSignUp() {
    this.updateError(false);
    this.completeSignUpForm.markAllAsTouched();

    if (this.completeSignUpForm.invalid) return;

    const data = {
      ...this.completeSignUpForm.getRawValue(),
      ...this.verifyEmailForm.getRawValue(),
    };

    data.firstName = this.titleCasePipe.transform(data.firstName);
    data.lastName = this.titleCasePipe.transform(data.lastName);
    data.birthDate = this.transformBirthDate(data.birthDate);

    delete data.password2;

    this.userApiService
      .completeSignUp(data)
      .then(() => {
        this.doSignIn(data.email, data.password);
      })
      .catch((error) => {
        if (apiError(error, 'ALREADY_EXISTS')) {
          this.updateError(
            true,
            'Já existe uma conta com esse Email, CPF ou Celular'
          );
        } else {
          this.updateError(true, 'Não foi possível criar a conta');
        }
      });
  }

  updateError(toggle: boolean, message: string = '') {
    this.isErrored = toggle;
    this.errorMessage = message;
  }
}
