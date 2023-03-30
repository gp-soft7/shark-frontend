export type StartTrigger = {
  name: string;
  miscCount: number;
  type: 'PATTERNS' | 'TIME' | 'CUSTOM';
};

export const START_TRIGGER_TYPE_ICONS = {
  PATTERNS: 'patterns',
  TIME: 'alarm',
  CUSTOM: 'dashboard_customize',
};

export const START_TRIGGER_TYPE_TITLES = {
  PATTERNS: 'Padrões',
  TIME: 'Horário',
  CUSTOM: 'Customizado',
};

export const START_TRIGGER_TYPE_MISC_COUNT_DESCRIPTION = {
  PATTERNS: 'padrões',
  TIME: 'horários',
  CUSTOM: 'regras',
}

export type StartTriggerList = StartTrigger[];
