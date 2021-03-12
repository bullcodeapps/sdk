import { TextStyle } from 'react-native';

import { GlobalStyle } from '../../../types';

export type SelectCustomStyle = {
  selectionColor: string;
  placeholder: string;
  dropdownIconColor?: string;
};

export type SelectStateStyles = TextStyle & SelectCustomStyle;

export interface SelectStyle extends GlobalStyle {
  name: string;
  default: SelectStateStyles;
  valid?: Partial<SelectStateStyles>;
  invalid?: Partial<SelectStateStyles>;
  disabled?: Partial<SelectStateStyles>;
};

export type SelectStyles = Array<SelectStyle>;
