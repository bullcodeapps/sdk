import { TextStyle, ViewStyle } from "react-native";

export type ButtonStyleTypes = {
  outline: {
    buttonStyle: ViewStyle & { color?: string },
    textStyle: TextStyle,
    textType?: string
  },
  solid: {
    buttonStyle: ViewStyle & { color?: string },
    textStyle: TextStyle,
    textType?: string
  },
};

export type ButtonStyle = {
  name: string;
  default: ButtonStyleTypes & { borderRadius?: number };
  active?: ButtonStyleTypes;
  disabled?: ButtonStyleTypes;
};

export type ContextButtonStyles = Array<ButtonStyle>;
