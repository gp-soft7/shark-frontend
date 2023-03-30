import { ModalSuccessComponent } from './modal-success/modal-success.component';
import { ModalWarningComponent } from './modal-warning/modal-warning.component';
import { ModalConfirmationComponent } from './modal-confirmation/modal-confirmation.component';
import { ModalConfirmationParams } from './modal-confirmation/modal-confirmation.component.types';
import { ModalRiskManagementComponent } from './../../../modules/operation/components/modal-risk-management/modal-risk-management.component';
import { ModalTermsOfServiceComponent } from './modal-terms-of-service/modal-terms-of-service.component';
import { ModalPrivacyPolicyComponent } from './modal-privacy-policy/modal-privacy-policy.component';
import { ModalArticleParams } from './modal-article/modal-article.component.types';
import { ModalArticleComponent } from './modal-article/modal-article.component';

export const MODAL_TYPES = {
  success: ModalSuccessComponent,
  warning: ModalWarningComponent,
  confirmation: ModalConfirmationComponent,
  'risk-management': ModalRiskManagementComponent,
  'terms-of-service': ModalTermsOfServiceComponent,
  'privacy-policy': ModalPrivacyPolicyComponent,
  article: ModalArticleComponent,
};

export type ModalCommonParams = {
  title?: string;
  text?: string;
  onClose?: () => void;
};

export type ModalOpenInput =
  | {
      name: 'success';
      data: ModalCommonParams;
    }
  | {
      name: 'warning';
      data: ModalCommonParams;
    }
  | {
      name: 'confirmation';
      data: ModalConfirmationParams;
    }
  | {
      name: 'risk-management';
      data: {};
    }
  | {
      name: 'terms-of-service';
      data: {};
    }
  | {
      name: 'privacy-policy';
      data: {};
    }
  | {
      name: 'article';
      data: ModalArticleParams;
    };
