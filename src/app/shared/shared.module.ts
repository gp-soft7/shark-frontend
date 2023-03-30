import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './components/input/input.component';
import { AutoSizeInputModule } from 'ngx-autosize-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { CurrencyMaskInputMode, NgxCurrencyModule } from 'ngx-currency';
import { OnlyNumbersDirective } from './directives/only-numbers.directive';
import { ButtonComponent } from './components/button/button.component';
import { ModalSuccessComponent } from './components/modal/modal-success/modal-success.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { RouterModule } from '@angular/router';
import { CompleteComponent } from './components/complete/complete.component';
import { ModalWarningComponent } from './components/modal/modal-warning/modal-warning.component';
import { HeaderComponent } from './components/header/header.component';
import { ModalConfirmationComponent } from './components/modal/modal-confirmation/modal-confirmation.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { AbsoluteValuePipe } from './pipes/absolute-value.pipe';
import { HeaderBreadcrumbsLayoutComponent } from './layouts/header-breadcrumbs/header-breadcrumbs.component';
import { BlankLayoutComponent } from './layouts/blank/blank.component';
import { ModalTermsOfServiceComponent } from './components/modal/modal-terms-of-service/modal-terms-of-service.component';
import { ModalPrivacyPolicyComponent } from './components/modal/modal-privacy-policy/modal-privacy-policy.component';
import { MarkdownModule } from 'ngx-markdown';
import { ModalArticleComponent } from './components/modal/modal-article/modal-article.component';
import { CompleteV2Component } from './components/complete-v2/complete-v2.component';
import { AlertComponent } from './components/alert/alert.component';

@NgModule({
  declarations: [
    InputComponent,
    OnlyNumbersDirective,
    ButtonComponent,
    ModalSuccessComponent,
    BreadcrumbsComponent,
    CompleteComponent,
    ModalWarningComponent,
    HeaderComponent,
    ModalConfirmationComponent,
    DropdownComponent,
    AbsoluteValuePipe,
    HeaderBreadcrumbsLayoutComponent,
    BlankLayoutComponent,
    ModalTermsOfServiceComponent,
    ModalPrivacyPolicyComponent,
    ModalArticleComponent,
    AlertComponent,
  ],
  imports: [
    CommonModule,
    AutoSizeInputModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgxMaskModule.forRoot({
      validation: true,
    }),
    NgxCurrencyModule.forRoot({
      align: 'left',
      allowNegative: true,
      allowZero: true,
      decimal: ',',
      precision: 2,
      prefix: '',
      suffix: '',
      thousands: '.',
      nullable: true,
      inputMode: CurrencyMaskInputMode.FINANCIAL,
    }),
    MarkdownModule.forRoot(),
  ],
  exports: [
    InputComponent,
    ButtonComponent,
    ModalSuccessComponent,
    BreadcrumbsComponent,
    CompleteComponent,
    OnlyNumbersDirective,
    ModalWarningComponent,
    HeaderComponent,
    ModalConfirmationComponent,
    DropdownComponent,
    AbsoluteValuePipe,
    ModalPrivacyPolicyComponent,
    ModalTermsOfServiceComponent,
    ModalArticleComponent,
    AlertComponent
  ],
})
export class SharedModule {}
