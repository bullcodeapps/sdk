import { TextStyle } from 'react-native';
import { FC } from 'react';

import { GlobalStyle } from '../../../types';

export type SelectCustomStyle = {
  selectionColor: string;
  placeholder: string;
  dropdownIconColor?: string;
};

export type AdornmentComponentTypeProps = {
  isValid?: boolean;
  colorName?: string;
  onPress?: (data: any) => void;
};

export type AdornmentComponentType = FC<AdornmentComponentTypeProps>;

export type SelectStateStyles = TextStyle & SelectCustomStyle;

export interface SelectStyle extends GlobalStyle {
  name: string;
  default: SelectStateStyles;
  valid?: Partial<SelectStateStyles>;
  invalid?: Partial<SelectStateStyles>;
  disabled?: Partial<SelectStateStyles>;
};

export type SelectStyles = Array<SelectStyle>;
