import { ValidityMarkComponentType } from '@bullcode/mobile/components/Form/Input/types';
import { TextStyle } from 'react-native';
import { NativeSelectStyle } from '@bullcode/mobile/components/Form/Select';
import { GlobalStyle } from '../../../types';

export type InputComponentCustomStyle = {
  selectionColor: string;
  placeholder: string;
};

export type PhoneInputInputComponentStyle = TextStyle & InputComponentCustomStyle;

export type SelectComponentCustomStyle = {
  placeholder: string;
  color: string;
  backgroundColor?: string;
  dropDownIcon?: string;
}

export type PhoneInputSelectComponentStyle = Partial<NativeSelectStyle> & SelectComponentCustomStyle;

export type PhoneInputComponents = {
  select: PhoneInputSelectComponentStyle;
  input: PhoneInputInputComponentStyle;
}

export type ValidityMarkColor = {
  backgroundColor: string;
  color: string;
};

export type ValidityMarkTypes = {
  valid: ValidityMarkColor;
  invalid: ValidityMarkColor;
};

export interface PhoneInputStyle extends GlobalStyle {
  name: string;
  default: PhoneInputComponents & { borderRadius?: number };
  valid?: Partial<PhoneInputComponents>;
  invalid?: Partial<PhoneInputComponents>;
  validityMarkComponent: ValidityMarkComponentType;
  validityMark: ValidityMarkTypes;
};

export type PhoneInputStyles = Array<PhoneInputStyle>;
