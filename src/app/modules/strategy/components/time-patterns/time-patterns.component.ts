import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { collapseAnimation, rotateAnimation } from 'angular-animations';
import { addDays, endOfYesterday, isAfter } from 'date-fns';
import { BlazeDoubleColor } from '../../../../core/blaze/types/double-color';
import { ResponsitivyService } from './../../../../shared/services/responsivity.service';
import {
  TimePatternIndex,
  TimePatternIndexes,
  TimePatternList,
} from './time-patterns.component.types';

@Component({
  selector: 'app-time-patterns',
  templateUrl: './time-patterns.component.html',
  styleUrls: ['./time-patterns.component.sass'],
  animations: [
    collapseAnimation(),
    rotateAnimation({
      degrees: 180,
    }),
  ],
})
export class TimePatternsComponent {
  patterns: TimePatternList = [];

  @Input()
  form: FormGroup;

  get strategyGame() {
    return this.form.get('game')?.value;
  }

  constructor(public responsitivy: ResponsitivyService) {}

  changePatternItemTarget(
    { patternIndex, patternItemIndex }: TimePatternIndexes,
    color: string
  ) {
    this.patterns[patternIndex].items[patternItemIndex].target =
      color as BlazeDoubleColor;
  }

  isPatternItemTarget(
    { patternIndex, patternItemIndex }: TimePatternIndexes,
    color: string
  ) {
    return this.patterns[patternIndex].items[patternItemIndex].target === color;
  }

  addPatternItem({ patternIndex }: TimePatternIndex) {
    this.patterns[patternIndex].items.push({
      target: this.strategyGame === 'DOUBLE' ? BlazeDoubleColor.RED : 2,
      time: '',
    });

    const patternItemIndex = this.patterns[patternIndex].items.length - 1;

    setTimeout(() => {
      const patternItemId = `#pattern-item-input${patternIndex}-${patternItemIndex}`;
      document.querySelector<HTMLElement>(patternItemId)?.focus();
    });
  }

  deletePatternItem({ patternIndex, patternItemIndex }: TimePatternIndexes) {
    this.patterns[patternIndex].items.splice(patternItemIndex, 1);
  }

  addPattern() {
    let nextDate = new Date();

    const nonExpiredPatterns = this.nonExpiredPatterns;

    if (nonExpiredPatterns.length > 0) {
      const lastPatternDate =
        nonExpiredPatterns[nonExpiredPatterns.length - 1].date;

      nextDate = addDays(lastPatternDate, 1);
    }

    this.patterns.push({
      date: nextDate,
      items: [],
      show: true,
      operateAllRounds: false
    });
  }

  deletePattern({ patternIndex }: TimePatternIndex) {
    //TODO: validar se existe uma lista de um dia próximo

    this.patterns.splice(patternIndex, 1);
  }

  get nonExpiredPatterns() {
    return this.patterns.filter((pattern) => !pattern.deadlineExpired);
  }

  hasMaxPatterns() {
    return this.nonExpiredPatterns.length === 3;
  }

  canDeletePattern({ patternIndex }: TimePatternIndex) {
    const pattern = this.patterns[patternIndex];

    return (
      patternIndex === this.patterns.length - 1 && !pattern.deadlineExpired
    );
  }

  resetPatterns() {
    this.patterns = [];
  }

  getPatternsForSubmit() {
    return this.patterns
      .filter((pattern) => !pattern.deadlineExpired)
      .map((pattern) => {
        pattern.items.sort((a, b) => {
          const [aHours, aMinutes] = a.time
            .split(':')
            .map((value) => Number(value));
          const [bHours, bMinutes] = b.time
            .split(':')
            .map((value) => Number(value));

          if (aHours === bHours && aMinutes === bMinutes) return 0;

          if (aHours > bHours) return 1;
          if (bHours > aHours) return -1;

          if (aHours === bHours) {
            if (aMinutes > bMinutes) return 1;
            else return -1;
          }

          return 0;
        });

        if (this.strategyGame === 'CRASH') {
          pattern.items = pattern.items.map((pattern) => {
            return { ...pattern, target: Number(pattern.target) };
          });
        }

        return pattern;
      });
  }

  parseAndLoad(patterns: any) {
    if (!patterns) return;

    const yesterday = endOfYesterday();

    this.patterns = patterns.map((pattern: any) => {
      const date = new Date(pattern.date);
      const deadlineExpired = isAfter(yesterday, date);

      return {
        ...pattern,
        date,
        deadlineExpired,
        show: true,
      };
    });
  }

  validate() {
    return (
      this.nonExpiredPatterns.length > 0 &&
      this.nonExpiredPatterns.some((pattern) => pattern.items.length > 0)
    );
  }
}
