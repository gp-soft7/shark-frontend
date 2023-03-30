export type CompleteInputs = Array<CompleteInput>;

export type CompleteInput = {
  type: CompleteInputTypes;
  text: string;
  defaultValue: any;
};

export type CompleteInputTypes = 'number';
