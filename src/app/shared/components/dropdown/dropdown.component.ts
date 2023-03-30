import {
  Component,
  Input,
  OnInit,
  ElementRef,
  ViewChild,
  NgZone,
} from '@angular/core';
import {
  fadeInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
} from 'angular-animations';
import { fromEvent } from 'rxjs';
import { DropdownItems } from './dropdown.component.types';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.sass'],
  animations: [
    fadeInOnEnterAnimation({ duration: 400 }),
    fadeOutOnLeaveAnimation({ duration: 400 }),
  ],
})
export class DropdownComponent implements OnInit {
  @ViewChild('dropdownContainer')
  dropdownContainer: ElementRef<HTMLDivElement>;

  isOpen = false;

  @Input()
  items: DropdownItems;

  @Input()
  handlerParams: any;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    fromEvent<MouseEvent>(document, 'mousedown').subscribe({
      next: (e) => {
        if (
          !(
            this.dropdownContainer &&
            this.dropdownContainer.nativeElement.contains(e.target as Node)
          )
        ) {
          this.ngZone.run(() => {
            this.close();
          });
        }
      },
    });
  }

  open = () => (this.isOpen = true);
  close = () => (this.isOpen = false);
  toggle = () => (this.isOpen = !this.isOpen);
}
