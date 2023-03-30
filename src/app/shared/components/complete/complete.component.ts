import {
  Component,
  ElementRef,
  forwardRef,
  Injector,
  Input,
  OnChanges,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
  FormGroup,
  NgControl,
  Validators,
} from '@angular/forms';
import { AppValidators } from '../../../core/validators/index.validators';
import { CompleteInputs } from './complete.component.types';

@Component({
  selector: 'app-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CompleteComponent),
      multi: true,
    },
  ],
})
export class CompleteComponent implements OnChanges, ControlValueAccessor {
  @Input()
  inputs: CompleteInputs;

  @ViewChildren('input')
  inputRefs: QueryList<ElementRef<HTMLInputElement>>;

  @Input()
  text: string;

  @Input()
  requiresActivation?: boolean;

  @Input()
  form: FormGroup;

  @Input()
  name: string;

  textParts: string[];
  inputFocus: boolean[] = [];
  inputFormControls: FormControl[] = [];
  isActivated = false;

  @Input()
  activationValidations?: any[];

  private onChange: (value: string[]) => void;
  private onTouched: () => void;

  constructor(private injector: Injector) {
    setTimeout(() => this.toggleActivate(false));
  }

  get currentControl() {
    return this.injector.get(NgControl).control;
  }

  get isDisabled() {
    return !this.hasActivated ? true : null;
  }

  get hasActivated() {
    return (
      !this.requiresActivation || (this.requiresActivation && this.isActivated)
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    changes['text'] && this.transformText(changes['text'].currentValue);
    changes['inputs'] &&
      this.setInitialInputValues(changes['inputs'].currentValue);
  }

  transformText(text: string) {
    const textParts = text
      .split('{}')
      .filter((textPart) => textPart.trim() !== '');

    this.textParts = textParts;
  }

  setInitialInputValues(inputs: CompleteInputs) {
    for (let i = 0; i < inputs.length; i++) {
      this.inputFocus[i] = false;
      this.inputFormControls[i] = new FormControl();
    }
  }

  setInputFocus(index: number, value: boolean) {
    this.inputFocus[index] = value;

    this.onTouched();
  }

  hasFocus(index: number) {
    return this.inputFocus[index] ?? false;
  }

  focusInput(index: number) {
    const stringIndex = index.toString();

    const foundInput = this.inputRefs.find((inputRef) =>
      inputRef.nativeElement.id.endsWith(stringIndex)
    );

    if (foundInput) {
      foundInput.nativeElement.select();
      foundInput.nativeElement.value = '';
    }
  }

  onActivateInputChange(event: Event) {
    if (event.target instanceof HTMLInputElement) {
      this.toggleActivate(event.target.checked);
    }
  }

  handleInputChange() {
    this.onChange(
      this.inputFormControls.map((input, index) => {
        const componentInput = this.inputs[index];

        if (componentInput.type === 'number') return Number(input.value);

        return input.value;
      })
    );
  }

  toggleActivate(toggle: boolean, disableFormControl = true) {
    this.isActivated = toggle;

    const control = this.currentControl;

    if (control) {
      if (this.isActivated) {
        let validatorsToAdd = [AppValidators.complete(Validators.required)];

        if (this.activationValidations) {
          validatorsToAdd = validatorsToAdd.concat(this.activationValidations);
        }

        control.addValidators(validatorsToAdd as any);
        control.updateValueAndValidity({ emitEvent: false });
        control.markAllAsTouched();
        disableFormControl && control.enable({ emitEvent: false });
      } else {
        control.clearValidators();
        control.updateValueAndValidity({ emitEvent: true });
        disableFormControl && control.disable({ emitEvent: false });
      }
    }

    this.onTouched();
  }

  writeValue(obj: any): void {
    if (!obj) return;
    if (!Array.isArray(obj)) return;

    obj.forEach((textPart: string, index: number) => {
      this.inputFormControls[index].setValue(textPart, { emitEvent: false });
    });

    this.toggleActivate(true);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.toggleActivate(!isDisabled, false);
  }
}
