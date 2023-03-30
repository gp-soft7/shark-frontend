import { Component, ViewChild, OnInit, HostListener } from '@angular/core';
import { ModalSuccessComponent } from './shared/components/modal/modal-success/modal-success.component';
import { ModalService } from './shared/services/modal.service';
import { ModalWarningComponent } from './shared/components/modal/modal-warning/modal-warning.component';
import { ModalConfirmationComponent } from './shared/components/modal/modal-confirmation/modal-confirmation.component';
import { ModalRiskManagementComponent } from './modules/operation/components/modal-risk-management/modal-risk-management.component';
import { ResponsitivyService } from './shared/services/responsivity.service';
import { ModalPrivacyPolicyComponent } from './shared/components/modal/modal-privacy-policy/modal-privacy-policy.component';
import { ModalTermsOfServiceComponent } from './shared/components/modal/modal-terms-of-service/modal-terms-of-service.component';
import { ModalArticleComponent } from './shared/components/modal/modal-article/modal-article.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  @ViewChild(ModalSuccessComponent, { static: true })
  modalSuccessComponent: ModalSuccessComponent;

  @ViewChild(ModalWarningComponent, { static: true })
  modalWarningComponent: ModalWarningComponent;

  @ViewChild(ModalConfirmationComponent, { static: true })
  modalConfirmationComponent: ModalConfirmationComponent;

  @ViewChild(ModalRiskManagementComponent, { static: true })
  modalRiskManagementComponent: ModalRiskManagementComponent;

  @ViewChild(ModalTermsOfServiceComponent, { static: true })
  modalTermsOfServiceComponent: ModalTermsOfServiceComponent;

  @ViewChild(ModalPrivacyPolicyComponent, { static: true })
  modalPrivacyPolicyComponent: ModalPrivacyPolicyComponent;

  @ViewChild(ModalArticleComponent, { static: true })
  modalArticleComponent: ModalArticleComponent;

  constructor(
    private modalService: ModalService,
    private responsitivyService: ResponsitivyService
  ) {}

  ngOnInit(): void {
    this.responsitivyService.update();
    this.modalService.update([
      this.modalSuccessComponent,
      this.modalWarningComponent,
      this.modalConfirmationComponent,
      this.modalRiskManagementComponent,
      this.modalTermsOfServiceComponent,
      this.modalPrivacyPolicyComponent,
      this.modalArticleComponent,
    ]);
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.responsitivyService.update();
  }
}
