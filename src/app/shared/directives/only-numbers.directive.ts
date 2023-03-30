import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyNumbers]',
})
export class OnlyNumbersDirective {
  private navigationKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'Escape',
    'Enter',
    'Home',
    'End',
    'ArrowLeft',
    'ArrowRight',
    'Clear',
    'Copy',
    'Paste',
  ];
  inputElement: HTMLElement;

  constructor(public elementRef: ElementRef) {
    this.inputElement = elementRef.nativeElement;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (
      this.navigationKeys.indexOf(event.key) > -1 || // Allow: navigation keys: backspace, delete, arrows etc.
      (event.key === 'a' && event.ctrlKey) || // Allow: Ctrl+A
      (event.key === 'c' && event.ctrlKey) || // Allow: Ctrl+C
      (event.key === 'v' && event.ctrlKey) || // Allow: Ctrl+V
      (event.key === 'x' && event.ctrlKey) || // Allow: Ctrl+X
      (event.key === 'a' && event.metaKey) || // Allow: Cmd+A (Mac)
      (event.key === 'c' && event.metaKey) || // Allow: Cmd+C (Mac)
      (event.key === 'v' && event.metaKey) || // Allow: Cmd+V (Mac)
      (event.key === 'x' && event.metaKey) || // Allow: Cmd+X (Mac)
      event.key === '.'
    ) {
      return;
    }
    if (event.key === ' ' || isNaN(Number(event.key))) {
      event.preventDefault();
    }
  }
}
