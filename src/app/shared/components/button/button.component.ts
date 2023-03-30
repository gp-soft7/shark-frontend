import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoadingService } from '../../services/loading.service';
import { ButtonVariant } from './button.component.types';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.sass'],
})
export class ButtonComponent {
  @Input()
  type = 'button';

  @Input()
  enableLoading = false;

  @Input()
  variant: ButtonVariant = 'primary';

  @Input()
  disabled = false;

  @Input()
  width?: string;

  @Output()
  onSafeClick = new EventEmitter();

  get isLoading() {
    return this.loadingService.isLoading && this.enableLoading;
  }

  click() {
    if (!this.disabled) this.onSafeClick.emit();
  }

  constructor(private loadingService: LoadingService) {}
}
