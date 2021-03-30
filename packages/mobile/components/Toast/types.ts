import { Ref } from 'react';
import { ViewStyle, TextStyle } from 'react-native';

export enum ActionTypeEnum {
  DISPLAY_INFO,
  DISPLAY_WARNING,
  DISPLAY_ERROR,
  HIDE,
};

export type ToastColor = {
  backgroundColor: string;
  color: string;
}

export type ToastColors = {
  info: ToastColor;
  warning: ToastColor;
  error: ToastColor;
}

export type ToastState = {
  message: string;
  actionType: ActionTypeEnum,
  timeout?: number;
  visibility?: boolean;
  reseter?: boolean;
  colors?: ToastColors;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export type ToastShowAction = (message: string, timeout?: number) => void

export type ToastComponentProps = {
  getState: () => ToastState,
  displayInfo: ToastShowAction,
  displayWarning: ToastShowAction,
  displayError: ToastShowAction,
  hide: () => void,
  setColors: (colors: ToastColors) => void,
};

export type ToastProviderProps = {
  ref?: Ref<ToastComponentProps>;
  colors?: ToastColors;
  children?: any;
};
