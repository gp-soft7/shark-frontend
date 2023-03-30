import { Component, Input, AfterViewInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-martingale-multipliers',
  templateUrl: './martingale-multipliers.component.html',
  styleUrls: ['./martingale-multipliers.component.sass'],
})
export class MartingaleMultipliersComponent implements AfterViewInit {
  @Input()
  form: FormGroup;

  @Input()
  customMultipliersControl: string;

  @Input()
  multiplierCountControl: string;

  @Input()
  maxMartingales = 100;

  get martingaleCustomMultipliers() {
    return this.form.get(this.customMultipliersControl) as FormArray;
  }

  constructor(private formBuilder: FormBuilder) {}
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.form.valueChanges
        .pipe(distinctUntilChanged(), debounceTime(50))
        .subscribe((values) => {
          const martingaleMultiplierCount = values[this.multiplierCountControl];
          if (!isNaN(martingaleMultiplierCount)) {
            const count = Number(martingaleMultiplierCount);

            if (count === 0) return;

            const length = this.martingaleCustomMultipliers.length;
            const difference = count - length;

            if (
              difference + length > this.maxMartingales ||
              difference + length < 0
            )
              return;

            if (difference > 0) {
              for (let i = 0; i < difference; i++) {
                this.addMartingaleCustomMultiplier(2);
              }
            } else {
              const absoluteDifference = Math.abs(difference);

              for (let i = absoluteDifference; i > 0; i--) {
                this.removeMartingaleCustomMultiplier(i);
              }
            }
          }
        });
    }, 200);
  }

  addMartingaleCustomMultiplier(multiplier = 2) {
    this.martingaleCustomMultipliers.push(
      this.formBuilder.group({
        multiplier: [multiplier],
      })
    );
  }

  removeMartingaleCustomMultiplier(index: number) {
    this.martingaleCustomMultipliers.removeAt(index);
  }
}
