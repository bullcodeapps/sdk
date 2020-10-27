import React, { useContext, useMemo } from 'react';

import { Text as RNText, TextStyle as RNTextStyle, TextProps as RNTextProps } from 'react-native';

export type TextType = {
  name: string;
  textStyles: RNTextStyle;
};

export type TextTypes = Array<TextType>;

export type TextContextType = { 
  types: TextTypes;
};

export const TextContext = React.createContext<TextContextType>({ types: null });

export const setTextTypes = (types: TextTypes) => {
  const ctx = useContext<TextContextType>(TextContext);
  ctx.types = types;
}

type TextProps = {
  type?: string;
} & RNTextProps;

/*
 * This component was made with the intention of facilitating the use of normal text, 
 * but it does not replace the text styles used in the other components of the SDK
 */
const Text: React.FC<TextProps> = ({ children, type, style, ...props }) => {
  const ctx = useContext<TextContextType>(TextContext);

  const textStyles: RNTextStyle = useMemo(() => {
    const types = ctx?.types || [];
    const defaultColor = types?.find((_type) => _type.name === 'default');
    if (!type && !!defaultColor) {
      return defaultColor?.textStyles || {};
    }
    const foundColor = types.find((_type) => _type.name === type);
    if (!foundColor) {
      console.log(`The "${type}" type does not exist, check if you wrote it correctly or if it was declared previously`)
      return {};
    }
    return foundColor?.textStyles;
  }, [type, ctx?.types]);

  return (
    <RNText style={[textStyles, style]} {...props}>
      {children}
    </RNText>
  );
}

export default Text