import { TextStyle, ViewStyle } from "react-native";

export type ButtonStyleType = {
  buttonStyle?: ViewStyle,
  textStyle?: TextStyle,
  textType?: string
};

export type ButtonStyleTypes = {
  outline: ButtonStyleType,
  solid: ButtonStyleType,
};

export type ButtonStyle = {
  name: string;
  default: ButtonStyleTypes;
  active?: ButtonStyleTypes;
  disabled?: ButtonStyleTypes;
  borderRadius?: number;
};

export type ContextButtonStyles = Array<ButtonStyle>;
