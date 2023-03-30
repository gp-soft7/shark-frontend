import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { InputErrorMessages, InputTypes } from './input.component.types';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.sass'],
})
export class InputComponent implements OnInit {
  @ViewChild('input')
  input: ElementRef<HTMLInputElement>;

  @Input()
  type: InputTypes = 'text';

  @Input()
  placeholder: string = '';

  @Input()
  name: string;

  @Input()
  label?: string;

  @Input()
  baseWidth?: string;

  @Input()
  inputWidth?: string;

  @Input()
  leftText?: string;

  @Input()
  rightText?: string;

  @Input()
  form: FormGroup | any;

  @Input()
  minWidth?: number;

  @Input()
  requiresActivation?: boolean;

  @Input()
  activationValidations?: any[];

  isActivated = false;
  hasFocus = false;
  isPasswordVisible = false;

  constructor() {}

  ngOnInit(): void {}

  get hasAnchorText() {
    return this.leftText || this.rightText;
  }

  get hasActivated() {
    return (
      !this.requiresActivation || (this.requiresActivation && this.isActivated)
    );
  }

  get isDisabled() {
    return !this.hasActivated ? true : null;
  }

  get currentControl(): FormControl {
    return this.form.get(this.name);
  }

  get hasError() {
    return (
      (this.currentControl?.touched || this.currentControl?.dirty) &&
      this.currentControl?.invalid
    );
  }

  focusInput() {
    if (this.input) this.input.nativeElement.focus();
  }

  toggleActivate() {
    this.isActivated = !this.isActivated;

    const control = this.currentControl;

    if (control) {
      if (this.isFromTypes(['checkbox'])) {
        control.patchValue(this.isActivated);
      }

      if (this.isActivated) {
        let validatorsToAdd = [Validators.required];

        if (this.activationValidations) {
          validatorsToAdd = validatorsToAdd.concat(this.activationValidations);
        }

        control.addValidators(validatorsToAdd);
        control.updateValueAndValidity({ emitEvent: false });
      } else {
        control.clearValidators();
        control.updateValueAndValidity({ emitEvent: true });
      }
    }

    setTimeout(() => {
      if (this.isActivated) this.focusInput();
    });
  }

  isFromType(type: InputTypes) {
    return this.type === type;
  }

  isFromTypes(types: InputTypes[]) {
    return types.includes(this.type);
  }

  getNextError() {
    const errors = this.currentControl?.errors;

    if (!errors) return;

    const errorKeys = Object.keys(errors);

    if (errorKeys.length === 0) return;

    const firstError = errors[errorKeys[0]];
    const foundError =
      InputErrorMessages[errorKeys[0] as keyof typeof InputErrorMessages];

    if (firstError !== null && typeof firstError === 'object') {
      const firstErrorFirstEntry = Object.values(firstError)[0];

      return foundError.replace('{}', firstErrorFirstEntry as string);
    }

    return foundError;
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
