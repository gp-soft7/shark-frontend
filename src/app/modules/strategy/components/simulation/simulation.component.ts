import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.sass'],
})
export class SimulationComponent implements OnInit {
  @Input()
  form: FormGroup;

  constructor() {}

  ngOnInit(): void {}
}
