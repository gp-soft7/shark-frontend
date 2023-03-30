export type DropdownItems = Array<DropdownItem>;

export type DropdownItem = {
  text: string;
  icon?: string;
  handler: (params: any) => void;
};
