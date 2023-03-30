import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { SigninComponent } from './pages/signin/signin.component';
import { GuestRoutingModule } from './guest-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';

@NgModule({
  declarations: [SigninComponent, ForgotPasswordComponent, ResetPasswordComponent],
  imports: [
    CommonModule,
    GuestRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [TitleCasePipe],
})
export class GuestModule {}
