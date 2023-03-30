import {
  Component,
  NgZone,
  OnInit,
  ElementRef,
  ViewChildren,
  QueryList,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import {
  BlazeBlackRolls,
  BlazeDoubleColor,
  BlazeRedRolls,
} from '../../../../core/blaze/types/double-color';
import { DropdownItems } from '../../../../shared/components/dropdown/dropdown.component.types';
import { ResponsitivyService } from '../../../../shared/services/responsivity.service';
import {
  DoublePatternIndex,
  DoublePatternIndexes,
  DoublePatterns,
  DOUBLE_COLOR_ABBREVIATIONS,
  PATTERN_ITEMS_CHAR_COLOR,
} from './double-patterns.component.types';

@Component({
  selector: 'app-double-patterns',
  templateUrl: './double-patterns.component.html',
  styleUrls: ['./double-patterns.component.sass'],
})
export class DoublePatternsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  patterns: DoublePatterns = [];

  openedConfigPatternItemIndex = -1;
  openedConfigPatternIndex = -1;

  openedConfigTargetPatternIndex = -1;

  blackRolls = BlazeBlackRolls;
  redRolls = BlazeRedRolls;

  dropdownItems: DropdownItems = [
    {
      text: 'Duplicar',
      icon: 'content_copy',
      handler: this.duplicatePattern.bind(this),
    },
    {
      text: 'Excluir',
      icon: 'close',
      handler: this.deletePattern.bind(this),
    },
  ];

  @ViewChildren('tooltipElement')
  tooltipElements: QueryList<any>;
  tooltipElementsChangeSubscription: Subscription;

  constructor(
    private ngZone: NgZone,
    public responsitivy: ResponsitivyService
  ) {}

  ngOnInit(): void {
    this.resetPatterns();

    fromEvent<MouseEvent>(document, 'mouseup').subscribe({
      next: (e) => {
        if (e.target instanceof HTMLDivElement) {
          if (!e.target.className.includes('config')) {
            this.ngZone.run(() => {
              this.closePatternItemConfig();
              this.closePatternTargetConfig();
            });
          }
        }
      },
    });
  }

  ngAfterViewInit(): void {
    this.tooltipElementsChangeSubscription =
      this.tooltipElements.changes.subscribe({
        next: () => {
          this.tooltipElements.forEach((element) => {
            this.updatePatternItemConfigPosition(element);
          });
        },
      });
  }

  ngOnDestroy(): void {
    this.tooltipElementsChangeSubscription.unsubscribe();
  }

  resetPatterns() {
    this.patterns = [];
  }

  addPattern() {
    this.patterns.push({
      target: BlazeDoubleColor.RED,
      pattern: [
        {
          color: this.getRandomBlazeDoubleColor(),
        },
      ],
    });
  }

  getRandomBlazeDoubleColor() {
    return [BlazeDoubleColor.RED, BlazeDoubleColor.BLACK][
      Math.floor(Math.random() * 2)
    ];
  }

  addPatternListItem({ patternIndex }: DoublePatternIndex) {
    this.patterns[patternIndex].pattern.push({
      color: BlazeDoubleColor.BLACK,
    });

    const patternItemIndex = this.patterns[patternIndex].pattern.length - 1;

    this.openPatternItemConfig({ patternIndex, patternItemIndex });
  }

  isPatternItemConfigOpen({
    patternIndex,
    patternItemIndex,
  }: DoublePatternIndexes) {
    return (
      patternIndex === this.openedConfigPatternIndex &&
      patternItemIndex === this.openedConfigPatternItemIndex
    );
  }

  openPatternItemConfig({
    patternIndex,
    patternItemIndex,
  }: DoublePatternIndexes) {
    this.openedConfigPatternIndex = patternIndex;
    this.openedConfigPatternItemIndex = patternItemIndex;
  }

  closePatternItemConfig() {
    this.openedConfigPatternItemIndex = -1;
    this.openedConfigPatternIndex = -1;
  }

  changePatternItemColor(
    { patternIndex, patternItemIndex }: DoublePatternIndexes,
    color: string
  ) {
    this.patterns[patternIndex].pattern[patternItemIndex] = {
      color: color as BlazeDoubleColor,
      roll: undefined,
    };
  }

  duplicatePattern({ patternIndex }: DoublePatternIndex) {
    const pattern = this.patterns[patternIndex];

    this.patterns.push(JSON.parse(JSON.stringify(pattern)));
  }

  deletePattern({ patternIndex }: DoublePatternIndex) {
    this.patterns.splice(patternIndex, 1);
  }

  deletePatternItem({ patternIndex, patternItemIndex }: DoublePatternIndexes) {
    this.patterns[patternIndex].pattern.splice(patternItemIndex, 1);

    this.closePatternItemConfig();
  }

  openPatternTargetConfig({ patternIndex }: DoublePatternIndex) {
    this.openedConfigTargetPatternIndex = patternIndex;
  }

  changePatternTarget({ patternIndex }: DoublePatternIndex, color: string) {
    this.patterns[patternIndex].target = color as BlazeDoubleColor;
  }

  isPatternTargetConfigOpen({ patternIndex }: DoublePatternIndex) {
    return this.openedConfigTargetPatternIndex === patternIndex;
  }

  closePatternTargetConfig() {
    this.openedConfigTargetPatternIndex = -1;
  }

  onPatternItemRollSelectChange(
    { target }: Event,
    { patternIndex, patternItemIndex }: DoublePatternIndexes
  ) {
    if (target instanceof HTMLSelectElement) {
      const value = target.value;

      this.patterns[patternIndex].pattern[patternItemIndex].roll =
        value === '#' ? undefined : Number(value);
    }
  }

  getPatternsForSubmit() {
    return this.patterns.map((pattern) => {
      return {
        ...pattern,
        pattern: pattern.pattern
          .map((item) => {
            let result = '';

            if (item.roll) result += item.roll;

            result += PATTERN_ITEMS_CHAR_COLOR[item.color];

            return result;
          })
          .join('-'),
      };
    });
  }

  parseColor(color: string) {
    return DOUBLE_COLOR_ABBREVIATIONS[
      color as keyof typeof DOUBLE_COLOR_ABBREVIATIONS
    ];
  }

  parseAndLoad(patterns: any) {
    this.patterns = patterns.map((pattern: any) => {
      return {
        ...pattern,
        pattern: pattern.pattern.split('-').map((item: any) => {
          const hasRoll = item.length > 1;
          let roll = undefined;
          let color = '';
          let patternItem: any = {};

          if (hasRoll) {
            if (item.length === 3) {
              roll = Number(item.substring(0, 2));
              color = this.parseColor(item[2]);
            }
            if (item.length === 2) {
              roll = Number(item[0]);
              color = this.parseColor(item[1]);
            }
            patternItem['roll'] = roll;
          } else {
            color = this.parseColor(item[0]);
          }

          patternItem['color'] = color;

          return patternItem;
        }),
      };
    });
  }

  updatePatternItemConfigPosition({
    nativeElement: element,
  }: ElementRef<HTMLDivElement>) {
    const boundingClientRect = element.getBoundingClientRect();
    const { left } = boundingClientRect;

    const defaultTranslateY = 'translateY(calc(-100% - 15px))';

    if (left < 0) {
      element.style.left = '0';
      element.style.transform = `translateX(0) ${defaultTranslateY}`;
    }

    if (left + element.clientWidth > window.outerWidth) {
      element.style.left = `0`;
      element.style.transform = `translateX(-${
        element.clientWidth - 55
      }px) ${defaultTranslateY}`;
    }
  }

  validate() {
    return (
      this.patterns.length > 0 &&
      this.patterns.every((pattern) => pattern.pattern.length > 0)
    );
  }
}
