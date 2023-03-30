import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { UserRoutingModule } from './user-routing.module';
import { MyAccountComponent } from './pages/my-account/my-account.component';
import { ModalChangePasswordComponent } from './components/modal-change-password/modal-change-password.component';

@NgModule({
  declarations: [
    MyAccountComponent,
    ModalChangePasswordComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    UserRoutingModule,
  ],
})
export class UserModule {}
