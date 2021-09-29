import { FC } from 'react';
import { TextStyle } from 'react-native';

import { GlobalStyle } from '../../../types';

export type AdornmentComponentTypeProps = {
  isValid?: boolean;
  colorName?: string;
  onPress?: (data: any) => void;
};

export type AdornmentComponentType = FC<AdornmentComponentTypeProps>;

export type CustomAdornmentComponentTypeProps = {
  isValid?: boolean;
  colorName?: string;
  onPress?: (data: any) => void;
  validValidityMarkIcon?: AdornmentComponentType;
  invalidValidityMarkIcon?: AdornmentComponentType;
};

export type CustomAdornmentComponentType = FC<CustomAdornmentComponentTypeProps>;

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
  validityMarkComponent: AdornmentComponentType;
  validityMark: ValidityMarkTypes;
};

export type InputStyles = Array<InputStyle>;
