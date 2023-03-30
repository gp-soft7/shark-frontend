import { ModalCommonParams } from '../../../../shared/components/modal/modal.component.types';

export type ModalViewCallsParams = ModalCommonParams & {
  accountType: 'DEMO' | 'REAL';
};
