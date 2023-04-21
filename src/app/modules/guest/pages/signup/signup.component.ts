import { Component, NgZone, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { AppValidators } from '../../../../core/validators/index.validators'
import { TitleCasePipe } from '@angular/common'
import { apiError } from '../../../../shared/helpers/functions/api-error.helper'
import { UserApiService } from '../../../user/services/user-api/user-api.service'
import { AuthService } from './../../../../core/services/auth.service'
import { ModalService } from './../../../../shared/services/modal.service'
import { ActivatedRoute, Router } from '@angular/router'
import { ResponsitivyService } from './../../../../shared/services/responsivity.service'
import { NgHcaptchaService } from 'ng-hcaptcha'
import { LoadingService } from './../../../../shared/services/loading.service'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.sass'],
})
export class SignupComponent implements OnInit {
  form: FormGroup

  isErrored = false
  errorMessage = ''

  isCompleting = false

  constructor(
    private formBuilder: FormBuilder,
    private titleCasePipe: TitleCasePipe,
    private userApiService: UserApiService,
    private authService: AuthService,
    public modalService: ModalService,
    private activatedRoute: ActivatedRoute,
    public responsitivy: ResponsitivyService,
    private router: Router,
    private hCaptchaService: NgHcaptchaService,
    private loadingService: LoadingService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.defineForm()
  }

  defineForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.maxLength(255)]],
      lastName: ['', [Validators.required, Validators.maxLength(255)]],
      // cpf: ['', [Validators.required, AppValidators.cpf]],
      // birthDate: ['', [Validators.required, AppValidators.dateString]],
      // cellphone: ['', [Validators.required, AppValidators.phone]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', [Validators.required, Validators.minLength(8)]],
    })

    this.form.valueChanges.subscribe((values) => {
      this.updateError(false)
      const { password, password2 } = values

      const password2Control = this.form.get('password2')

      if (!password2Control) return

      if (password2Control.dirty) {
        password2Control.setErrors(
          password !== password2
            ? {
                invalidPasswordConfirmation: true,
              }
            : null,
          { emitEvent: true }
        )
      }
    })

    const email = this.activatedRoute.snapshot.queryParamMap.get('email')

    if (email) {
      this.form.get('email')?.setValue(email, { emitEvent: false })
      this.isCompleting = true
    }
  }

  submit() {
    this.loadingService.startLoading()

    this.hCaptchaService.verify().subscribe({
      next: (captcha) => {
        this.ngZone.run(() => {
          this.updateError(false)
          this.form.markAllAsTouched()

          if (this.form.invalid) return

          const data = {
            ...this.form.getRawValue(),
            captcha,
          }

          data.firstName = this.titleCasePipe.transform(data.firstName)
          data.lastName = this.titleCasePipe.transform(data.lastName)
          // data.birthDate = this.transformBirthDate(data.birthDate)

          delete data.password2

          const call = this.isCompleting
            ? this.userApiService.completeSignUp(data)
            : this.userApiService.signUp(data)

          call
            .then(async () => {
              await this.authService.signIn(data.email, data.password)
              this.router.navigate([''])
            })
            .catch((error) => {
              if (apiError(error, 'ALREADY_EXISTS')) {
                this.updateError(
                  true,
                  'Já existe uma conta com esse Email, CPF ou Celular'
                )
              } else {
                this.updateError(true, 'Não foi possível criar a conta')
              }
            })
        })
      },
      complete: () => {
        this.loadingService.stopLoading()
      },
    })
  }

  updateError(toggle: boolean, message: string = '') {
    this.isErrored = toggle
    this.errorMessage = message
  }

  transformBirthDate(date: string) {
    const [day, month, year] = date.split('/')

    return `${year}-${month}-${day}`
  }
}
