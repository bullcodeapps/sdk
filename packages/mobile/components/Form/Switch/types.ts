export type SwitchStyles = {
  backgroundColor: string;
  thumbColor: string;
};

export type SwitchColorTypes = {
  falseStyle: SwitchStyles;
  trueStyle?: SwitchStyles;
};

export type SwitchColor = {
  name: string;
  default: SwitchColorTypes;
};

export type SwitchColors = Array<SwitchColor>;
