import { Component, OnInit, ViewChild } from '@angular/core';
import { DropdownItems } from '../../../../shared/components/dropdown/dropdown.component.types';
import { ModalStartTriggersComponent } from './../../components/modal-start-triggers/modal-start-triggers.component';
import {
  StartTriggerList,
  START_TRIGGER_TYPE_ICONS,
  START_TRIGGER_TYPE_MISC_COUNT_DESCRIPTION,
  START_TRIGGER_TYPE_TITLES,
} from './start-triggers.component.types';

@Component({
  selector: 'app-start-triggers',
  templateUrl: './start-triggers.component.html',
  styleUrls: ['./start-triggers.component.sass'],
})
export class StartTriggersComponent implements OnInit {
  @ViewChild(ModalStartTriggersComponent, { static: true })
  modalStartTriggersComponent: ModalStartTriggersComponent;

  visibleTriggerItems: boolean[] = [];

  triggerItemDropdownItems: DropdownItems = [
    {
      text: 'Editar',
      icon: 'edit',
      handler: () => {},
    },
    {
      text: 'Excluir',
      icon: 'delete_forever',
      handler: () => {},
    },
  ];

  triggers: StartTriggerList = [
    {
      name: 'horarios',
      miscCount: 372,
      type: 'TIME',
    },
    {
      name: 'branco',
      miscCount: 2,
      type: 'PATTERNS',
    },
    {
      name: 'ooohmaga',
      miscCount: 5,
      type: 'CUSTOM',
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  getStartTriggerTypeIcon(type: string) {
    return START_TRIGGER_TYPE_ICONS[
      type as keyof typeof START_TRIGGER_TYPE_ICONS
    ];
  }

  getStartTriggerTypeTitle(type: string) {
    return START_TRIGGER_TYPE_TITLES[
      type as keyof typeof START_TRIGGER_TYPE_TITLES
    ];
  }

  getStartTriggerTypeMiscCountDescription(type: string) {
    return START_TRIGGER_TYPE_MISC_COUNT_DESCRIPTION[
      type as keyof typeof START_TRIGGER_TYPE_MISC_COUNT_DESCRIPTION
    ];
  }
}
