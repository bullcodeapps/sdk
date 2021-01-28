import React, { useContext, useMemo, Ref } from 'react';

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
};

export interface TextProps extends RNTextProps {
  type?: string;
};

interface InternalTextProps extends TextProps {
  outerRef?: Ref<RNText>;
  children?: React.ReactNode;
};

export type InternalTextComponent = React.FC<InternalTextProps>;

export type TextComponent = React.FC<TextProps>;

/*
 * This component was made with the intention of facilitating the use of normal text,
 * but it does not replace the text styles used in the other components of the SDK
 */
const Component: InternalTextComponent = ({ children, type, style, outerRef, ...props }: InternalTextProps) => {
  const ctx = useContext<TextContextType>(TextContext);

  const textStyles: RNTextStyle = useMemo(() => {
    const types = ctx?.types || [];
    const defaultColor = types?.find((_type) => _type.name === 'default');
    if (!type && !!defaultColor) {
      return defaultColor?.textStyles || {};
    }
    const foundColor = types.find((_type) => _type.name === type);
    if (!foundColor) {
      console.log(
        `The "${type}" type does not exist, check if you wrote it correctly or if it was declared previously`,
      );
      return {};
    }
    return foundColor?.textStyles;
  }, [type, ctx?.types]);

  return (
    <RNText ref={outerRef} style={[textStyles, style]} {...props}>
      {children}
    </RNText>
  );
};

const Text: TextComponent = React.forwardRef<RNText, TextProps>((props, ref) => <Component outerRef={ref} {...props} />);

export default Text;
