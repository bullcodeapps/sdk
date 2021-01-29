import { TextStyle as RNTextStyle } from 'react-native';

export type TextType = {
  name: string;
  textStyles: RNTextStyle;
};

export type TextTypes = Array<TextType>;
