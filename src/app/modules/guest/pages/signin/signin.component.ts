import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AuthApiService } from './../../../../core/services/auth-api/auth-api.service'
import { Router } from '@angular/router'
import { Title } from '@angular/platform-browser'
import { apiError } from './../../../../shared/helpers/functions/api-error.helper'
import { ResponsitivyService } from './../../../../shared/services/responsivity.service'
import { ModalService } from './../../../../shared/services/modal.service'
import { AuthService } from './../../../../core/services/auth.service'

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.sass'],
})
export class SigninComponent implements OnInit {
  signInForm: FormGroup
  verifyEmailForm: FormGroup

  isErrored = false
  errorMessage = ''

  step = 'VERIFY_EMAIL'

  constructor(
    private formBuilder: FormBuilder,
    private authApiService: AuthApiService,
    private router: Router,
    private title: Title,
    public responsitivy: ResponsitivyService,
    public modalService: ModalService,
    private authService: AuthService
  ) {
    this.title.setTitle('Fazer login - Shark')
  }

  ngOnInit(): void {
    this.defineForms()
  }

  defineForms() {
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    })

    this.verifyEmailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    })
    ;[this.signInForm, this.verifyEmailForm].forEach((form) =>
      form.valueChanges.subscribe(() => {
        this.updateError(false)
      })
    )
  }

  verifyEmail() {
    this.updateError(false)
    this.verifyEmailForm.markAllAsTouched()

    if (this.verifyEmailForm.invalid) return

    const { email } = this.verifyEmailForm.getRawValue()

    this.authApiService
      .verifyEmail(email)
      .then(() => {
        this.step = 'SIGN_IN'

        setTimeout(() => {
          this.signInForm.get('email')?.setValue(email)

          this.focusInput('input[name="password"]')
        })
      })
      .catch((error) => {
        if (apiError(error, 'USER_INCOMPLETE')) {
          setTimeout(() => {
            this.focusInput('input[name="firstName"]')
          })

          const email = this.verifyEmailForm.get('email')?.value

          this.router.navigate(['signup'], {
            queryParams: {
              email,
            },
          })
        } else {
          this.updateError(true, 'Não há nenhuma conta com esse email')
        }
      })
  }

  focusInput(selector: string) {
    const selectedInput: HTMLElement = <HTMLElement>(
      document.querySelector(selector)
    )

    selectedInput.focus()
  }

  async signIn() {
    this.updateError(false)
    this.signInForm.markAllAsTouched()

    if (this.signInForm.invalid) return

    const { email, password } = this.signInForm.getRawValue()

    const signedIn = await this.authService.signIn(email, password)

    if (signedIn) this.router.navigate([''])
    else this.updateError(true, 'Não foi possível fazer login')
  }

  updateError(toggle: boolean, message: string = '') {
    this.isErrored = toggle
    this.errorMessage = message
  }
}
