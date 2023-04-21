import { NgModule } from '@angular/core'
import { CommonModule, TitleCasePipe } from '@angular/common'
import { SigninComponent } from './pages/signin/signin.component'
import { GuestRoutingModule } from './guest-routing.module'
import { SharedModule } from '../../shared/shared.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component'
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component'
import { SignupComponent } from './pages/signup/signup.component'
import { NgHcaptchaModule } from 'ng-hcaptcha'

@NgModule({
  declarations: [
    SigninComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    SignupComponent,
  ],
  imports: [
    CommonModule,
    GuestRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgHcaptchaModule.forRoot({
      siteKey: '932d654b-e1b1-4113-b899-1237fab67766',
    }),
  ],
  providers: [TitleCasePipe],
})
export class GuestModule {}
