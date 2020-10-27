import React, { memo, useContext, useMemo } from 'react';

import { ButtonColors, Container, ButtonBox, ButtonText, ButtonSyles, ButtonTextSyles, DefaultButtonColors } from './styles';
import {
  GestureResponderEvent,
  ActivityIndicator,
  ViewStyle,
  ViewProps,
  TouchableOpacity,
  View,
} from 'react-native';

export type ButtonContextType = { colors: ButtonColors };

export const ButtonContext = React.createContext<ButtonContextType>({ colors: null });

export const setButtonColors = (colors: ButtonColors) => {
  const ctx = useContext<ButtonContextType>(ButtonContext);
  ctx.colors = colors;
}

export type ButtonProps = {
  ref?: React.Ref<View>;
  outerRef?: React.Ref<View>;
  disabled?: boolean;
  outline?: boolean;
  loading?: boolean;
  loadingSize?: number | 'small' | 'large';
  children?: any;
  activityIndicatorColor?: string;
  color?: string;
  containerStyle?: ViewStyle;
  activeOpacity?: number;
  onPress: (event: GestureResponderEvent) => void;
} & ViewProps;

export type ButtonComponent = React.FC<ButtonProps>;

const Component: ButtonComponent = ({
  outerRef,
  disabled,
  outline,
  color,
  activityIndicatorColor,
  loading,
  loadingSize,
  children,
  activeOpacity,
  containerStyle,
  onPress,
  onLayout,
  ...rest
}: ButtonProps) => {
  const ctx = useContext<ButtonContextType>(ButtonContext);

  const buttonColorStyles: Partial<ButtonSyles> = useMemo(() => {
    const colors = ctx?.colors || DefaultButtonColors;
    const foundColor = colors.find((_color) => _color.name === color);
    if (!foundColor) {
      console.log(`The "${color}" color does not exist, check if you wrote it correctly or if it was declared previously`)
      return {};
    }
    if (disabled) {
      const { color: textColor, ...buttonStyles } = foundColor.disabled[outline ? 'outline' : 'solid'];
      const borderRadius = foundColor?.disabled?.borderRadius;
      if (borderRadius) {
        return {...buttonStyles, borderRadius}; 
      }
      return buttonStyles;
    }
    const { color: textColor, ...buttonStyles } = foundColor.default[outline ? 'outline' : 'solid'];
    const borderRadius = foundColor?.default?.borderRadius;
    if (borderRadius) {
      return {...buttonStyles, borderRadius}; 
    }
    return buttonStyles;
  }, [color, disabled, outline]);

  const buttonTextColorStyles: Partial<ButtonTextSyles> = useMemo(() => {
    const colors = ctx?.colors || DefaultButtonColors;
    const foundColor = colors.find((_color) => _color.name === color);
    if (!foundColor) {
      console.log(`The "${color}" color does not exist, check if you wrote it correctly or if it was declared previously`)
      return {};
    }
    if (disabled) {
      const { color: textColor } = foundColor.disabled[outline ? 'outline' : 'solid'];
      return { color: textColor };
    }
    const { color: textColor } = foundColor.default[outline ? 'outline' : 'solid'];
    return { color: textColor };
  }, [color, disabled, outline]);

  return (
    <Container ref={outerRef} style={containerStyle} onLayout={onLayout}>
      <TouchableOpacity
        onPress={(e) => !loading && !disabled && onPress && onPress(e)}
        activeOpacity={activeOpacity || 0.8}>
        <ButtonBox style={[buttonColorStyles, rest?.style]} {...rest}>
          {loading ? (
            <ActivityIndicator
              size={loadingSize || 'small'}
              color={activityIndicatorColor ? activityIndicatorColor : buttonTextColorStyles.color}
            />
          ) : typeof children === 'string' ? (
            <ButtonText style={[buttonTextColorStyles]}>
              {children}
            </ButtonText>
          ) : (
            children
          )}
        </ButtonBox>
      </TouchableOpacity>
    </Container>
  );
};

const Button: ButtonComponent = React.forwardRef<View, ButtonProps>((props, ref) => (
  <Component outerRef={ref} {...props} />
));

export default memo(Button);
