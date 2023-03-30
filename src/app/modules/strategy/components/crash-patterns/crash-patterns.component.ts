import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { BlazeCrashColor } from '../../../../core/blaze/types/crash-color';
import { DropdownItems } from '../../../../shared/components/dropdown/dropdown.component.types';
import { ResponsitivyService } from '../../../../shared/services/responsivity.service';
import {
  CrashPatternIndex,
  CrashPatternIndexes,
  CrashPatterns,
} from './crash-patterns.component.types';

@Component({
  selector: 'app-crash-patterns',
  templateUrl: './crash-patterns.component.html',
  styleUrls: ['./crash-patterns.component.sass'],
})
export class CrashPatternsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  patterns: CrashPatterns = [];

  openedConfigPatternItemIndex = -1;
  openedConfigPatternIndex = -1;

  openedConfigTargetPatternIndex = -1;

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
      target: 2,
      pattern: [{ color: this.getRandomBlazeCrashColor() }],
    });
  }

  getRandomBlazeCrashColor() {
    return [BlazeCrashColor.GREEN, BlazeCrashColor.BLACK][
      Math.floor(Math.random() * 2)
    ];
  }

  addPatternListItem({ patternIndex }: CrashPatternIndex) {
    this.patterns[patternIndex].pattern.push({ color: BlazeCrashColor.BLACK });

    const patternItemIndex = this.patterns[patternIndex].pattern.length - 1;

    this.openPatternItemConfig({ patternIndex, patternItemIndex });
  }

  isPatternItemConfigOpen({
    patternIndex,
    patternItemIndex,
  }: CrashPatternIndexes) {
    return (
      patternIndex === this.openedConfigPatternIndex &&
      patternItemIndex === this.openedConfigPatternItemIndex
    );
  }

  openPatternItemConfig({
    patternIndex,
    patternItemIndex,
  }: CrashPatternIndexes) {
    this.openedConfigPatternIndex = patternIndex;
    this.openedConfigPatternItemIndex = patternItemIndex;
  }

  closePatternItemConfig() {
    this.openedConfigPatternItemIndex = -1;
    this.openedConfigPatternIndex = -1;
  }

  changePatternItemColor(
    { patternIndex, patternItemIndex }: CrashPatternIndexes,
    color: string
  ) {
    this.patterns[patternIndex].pattern[patternItemIndex] = {
      color: color as BlazeCrashColor,
      conditional: undefined,
    };

    this.closePatternItemConfig();
  }

  duplicatePattern({ patternIndex }: CrashPatternIndex) {
    const pattern = this.patterns[patternIndex];

    this.patterns.push(JSON.parse(JSON.stringify(pattern)));
  }

  deletePattern({ patternIndex }: CrashPatternIndex) {
    this.patterns.splice(patternIndex, 1);
  }

  deletePatternItem({ patternIndex, patternItemIndex }: CrashPatternIndexes) {
    this.patterns[patternIndex].pattern.splice(patternItemIndex, 1);

    this.closePatternItemConfig();
  }

  openPatternTargetConfig({ patternIndex }: CrashPatternIndex) {
    this.openedConfigTargetPatternIndex = patternIndex;
  }

  onPatternItemTargetInputChange(
    event: Event,
    { patternIndex }: CrashPatternIndex
  ) {
    if (event.target instanceof HTMLInputElement) {
      const value = event.target.value as any;

      if (!isNaN(value)) {
        this.patterns[patternIndex].target = Number(value);
      }
    }
  }

  isPatternTargetConfigOpen({ patternIndex }: CrashPatternIndex) {
    return this.openedConfigTargetPatternIndex === patternIndex;
  }

  closePatternTargetConfig() {
    this.openedConfigTargetPatternIndex = -1;
  }

  getPatternsForSubmit() {
    return this.patterns.map((pattern) => {
      return {
        ...pattern,
        pattern: pattern.pattern.map((item) => {
          const mappedItem: any = {
            color: item.color === 'black' ? 'B' : 'G',
          };

          if (item.conditional) {
            mappedItem['conditional'] = item.conditional;

            delete mappedItem.color;
          }

          return mappedItem;
        }),
      };
    });
  }

  parseAndLoad(patterns: any) {
    this.patterns = patterns.map((pattern: any) => {
      return {
        ...pattern,
        pattern: pattern.pattern.map((item: any) => {
          // const mappedItem = {
          //   color:
          //     item.color === 'B'
          //       ? BlazeCrashColor.BLACK
          //       : BlazeCrashColor.GREEN,
          //   conditional: item.conditional ? item.conditional : undefined,
          // };

          const mappedItem: any = {};

          if (item.color) {
            mappedItem.color =
              item.color === 'B'
                ? BlazeCrashColor.BLACK
                : BlazeCrashColor.GREEN;
          }

          if (item.conditional) {
            mappedItem.conditional = item.conditional
              ? item.conditional
              : undefined;
          }

          return mappedItem;
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

  changePatternItemConditional(
    { patternIndex, patternItemIndex }: CrashPatternIndexes,
    conditional: string,
    rawTarget: string
  ) {
    const target = Number(rawTarget);

    this.patterns[patternIndex].pattern[patternItemIndex] = {
      color: BlazeCrashColor.BLACK,
      conditional: `${conditional} ${target}`,
    };

    this.closePatternItemConfig();
  }

  changePatternItemConditionalRange(
    { patternIndex, patternItemIndex }: CrashPatternIndexes,
    rawStartValue: string,
    rawEndValue: string
  ) {
    const startValue = Number(rawStartValue);
    const endValue = Number(rawEndValue);

    this.patterns[patternIndex].pattern[patternItemIndex] = {
      color: BlazeCrashColor.BLACK,
      conditional: `${startValue} - ${endValue}`,
    };

    this.closePatternItemConfig();
  }

  resetInputValueOnFocus(event: FocusEvent) {
    event.target && ((event.target as HTMLInputElement).value = '');
  }

  validate() {
    return (
      this.patterns.length > 0 &&
      this.patterns.every((pattern) => pattern.pattern.length > 0)
    );
  }
}
