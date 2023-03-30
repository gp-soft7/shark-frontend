import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'absolute' })
export class AbsoluteValuePipe implements PipeTransform {
  transform(value: number): number {
    return Math.abs(value);
  }
}
