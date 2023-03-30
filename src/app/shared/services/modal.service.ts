import { Injectable } from '@angular/core';
import { ModalComponent } from '../components/modal/modal.component';
import { ModalOpenInput } from '../components/modal/modal.component.types';
import { MODAL_TYPES } from './../components/modal/modal.component.types';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  popups: Array<ModalComponent<any>> = [];

  update(popups: Array<ModalComponent<any>>) {
    this.popups = this.popups.concat(popups);
  }

  open(popupInput: ModalOpenInput) {
    const popupType = MODAL_TYPES[popupInput.name];
    const foundPopup = this.popups.find((popup) => popup instanceof popupType);

    if (foundPopup) {
      foundPopup.params = popupInput.data;
      foundPopup.open();
    }
  }

  openRaw(popupName: keyof typeof MODAL_TYPES) {
    const popupType = MODAL_TYPES[popupName];
    const foundPopup = this.popups.find((popup) => popup instanceof popupType);

    if (foundPopup) {
      foundPopup.open();
    }
  }
}
