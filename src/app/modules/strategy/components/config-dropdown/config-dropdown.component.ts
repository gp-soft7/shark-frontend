import { Component, Input } from '@angular/core';
import { collapseAnimation, rotateAnimation } from 'angular-animations';
import { ConfigDropdownTip } from './config-dropdown.component.types';

@Component({
  selector: 'app-config-dropdown',
  templateUrl: './config-dropdown.component.html',
  styleUrls: ['./config-dropdown.component.sass'],
  animations: [
    collapseAnimation(),
    rotateAnimation({
      degrees: 180,
    }),
  ],
})
export class ConfigDropdownComponent {
  @Input()
  title: string;

  @Input()
  isOpen = true;

  @Input()
  tip?: ConfigDropdownTip;

  constructor() {}

  open = () => (this.isOpen = true);
  close = () => (this.isOpen = false);
}
