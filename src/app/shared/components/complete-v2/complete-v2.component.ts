import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-complete-v2',
  templateUrl: './complete-v2.component.html',
  styleUrls: ['./complete-v2.component.sass'],
})
export class CompleteV2Component implements OnInit {
  @Input()
  schema: string;

  constructor() {}

  ngOnInit(): void {}
}
