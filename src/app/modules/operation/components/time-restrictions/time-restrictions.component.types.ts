export type TimeRestriction = {
  from: string;
  to: string;
  hasError?: boolean;
};

export type TimeRestrictionList = Array<TimeRestriction>;
