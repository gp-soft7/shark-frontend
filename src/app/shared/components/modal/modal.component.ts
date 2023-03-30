export abstract class ModalComponent<TParams> {
  isOpen = false;

  params: TParams;

  open() {
    this.isOpen = true;
    this.beforeOpen();
    this.onOpen();
  }

  openWithParams(params: TParams) {
    this.params = params;
    this.open();
  }

  close() {
    this.isOpen = false;
    this.beforeClose(this);
    this.onClose(this);
  }

  onOpen() {}

  onClose(component: ModalComponent<TParams>) {}

  beforeOpen() {}

  beforeClose(component: ModalComponent<TParams>) {}

  constructor() {
    document.addEventListener('keydown', (event) => {
      if (this.isOpen && event.key === 'Escape') {
        this.close();
      }
    });
  }
}
