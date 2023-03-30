import { ModalCommonParams } from '../modal.component.types';

export type ModalConfirmationParams = ModalCommonParams & {
  onConfirmation: () => void;
};
