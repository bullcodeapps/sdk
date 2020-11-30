export type ButtonStyles = {
  backgroundColor: string,
  borderColor: string,
};

export type ButtonTextStyles = {
  color: string,
};

export type ButtonColorTypes = {
  outline: ButtonStyles & ButtonTextStyles,
  solid: ButtonStyles & ButtonTextStyles,
  borderRadius?: number,
};

export type ButtonActiveColorTypes = {
  outline: ButtonStyles,
  solid: ButtonStyles,
};

export type ButtonColor = {
  name: string;
  default: ButtonColorTypes;
  active?: ButtonActiveColorTypes;
  disabled?: ButtonColorTypes;
};

export type ButtonColors = Array<ButtonColor>;