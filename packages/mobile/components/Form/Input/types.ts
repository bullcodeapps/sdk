import { FC } from 'react';
import { TextStyle } from 'react-native';

import { GlobalStyle } from '../../../types';

export type ValidityMarkComponentProps = {
  isValid?: boolean;
  colorName?: string;
  onPress?: (data: any) => void;
};

export type ValidityMarkComponentType = FC<ValidityMarkComponentProps>;

type CustomStyles = {
  selectionColor: string,
  placeholder: string,
};

export type InputStateStyles = TextStyle & CustomStyles;

export type ValidityMarkColor = {
  backgroundColor: string;
  color: string;
};

export type ValidityMarkTypes = {
  valid: ValidityMarkColor;
  invalid: ValidityMarkColor;
};

export interface InputStyle extends GlobalStyle {
  name: string;
  default: InputStateStyles;
  valid?: Partial<InputStateStyles>;
  invalid?: Partial<InputStateStyles>;
  validityMarkComponent: ValidityMarkComponentType;
  validityMark: ValidityMarkTypes;
};

export type InputStyles = Array<InputStyle>;
