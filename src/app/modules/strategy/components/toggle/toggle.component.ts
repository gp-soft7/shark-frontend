import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { ToggleOption, ToggleOptions } from './toggle.component.types';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.sass'],
})
export class ToggleComponent implements OnInit {
  @Input()
  options: ToggleOptions;

  @Input()
  selected: string;

  @Output()
  onSelected = new EventEmitter<ToggleOption>();

  constructor() {}

  ngOnInit() {}
}
