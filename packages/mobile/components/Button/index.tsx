import React, { memo, useContext, useMemo, useState } from 'react';

import {
  ButtonColors,
  Container,
  ButtonBox,
  ButtonText,
  ButtonStyles,
  ButtonTextStyles,
  DefaultButtonColors,
} from './styles';
import {
  GestureResponderEvent,
  ActivityIndicator,
  ViewStyle,
  ViewProps,
  TouchableHighlight,
  View,
} from 'react-native';
import { LightenDarkenColor } from '@bullcode/core/utils';

export type ButtonContextType = { colors: ButtonColors };

export const ButtonContext = React.createContext<ButtonContextType>({ colors: null });

export const setButtonColors = (colors: ButtonColors) => {
  const ctx = useContext<ButtonContextType>(ButtonContext);
  ctx.colors = colors;
};

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
  containerStyle,
  onPress,
  onLayout,
  ...rest
}: ButtonProps) => {
  const ctx = useContext<ButtonContextType>(ButtonContext);

  const [showingUnderlay, setShowingUnderlay] = useState<boolean>(false);

  const buttonUnderlayColor: string = useMemo((): string => {
    const colors = ctx?.colors || DefaultButtonColors;
    const foundColor = colors.find((_color) => _color.name === color);
    if (!foundColor) {
      console.log(
        `The color "${color}" has no colors defined for the active state, check if the color of the button is the desired one or if this color has actually been declared previously`,
      );
      return null;
    }
    if (disabled) {
      return !outline && foundColor?.disabled?.solid?.backgroundColor
        ? LightenDarkenColor(foundColor.disabled.solid.backgroundColor, 1.1)
        : 'transparent';
    }
    return (
      (outline ? foundColor?.active?.outline?.backgroundColor : foundColor?.active?.solid?.backgroundColor) ||
      'transparent'
    );
  }, [color, ctx?.colors, disabled, outline]);

  const buttonColorStyles: Partial<ButtonStyles> = useMemo(() => {
    const colors = ctx?.colors || DefaultButtonColors;
    const foundColor = colors.find((_color) => _color.name === color);
    if (!foundColor) {
      console.log(
        `The "${color}" color does not exist, check if you wrote it correctly or if it was declared previously`,
      );
      return {};
    }

    const { color: textColor, ...buttonStyles } = foundColor.default[outline ? 'outline' : 'solid'];
    const borderRadius = foundColor?.default?.borderRadius;
    if (showingUnderlay) {
      return { ...buttonStyles, backgroundColor: buttonUnderlayColor || buttonStyles?.backgroundColor, borderRadius };
    }

    if (disabled) {
      const { color: textColor, ...buttonStyles } = foundColor.disabled[outline ? 'outline' : 'solid'];
      const borderRadius = foundColor?.disabled?.borderRadius;
      if (borderRadius) {
        return { ...buttonStyles, borderRadius };
      }
      return buttonStyles;
    }
    if (borderRadius) {
      return { ...buttonStyles, borderRadius };
    }
    return buttonStyles;
  }, [buttonUnderlayColor, color, ctx?.colors, disabled, outline, showingUnderlay]);

  const buttonTextColorStyles: Partial<ButtonTextStyles> = useMemo(() => {
    const colors = ctx?.colors || DefaultButtonColors;
    const foundColor = colors.find((_color) => _color.name === color);
    if (!foundColor) {
      console.log(
        `The "${color}" color does not exist, check if you wrote it correctly or if it was declared previously`,
      );
      return {};
    }
    if (disabled) {
      const { color: textColor } = foundColor.disabled[outline ? 'outline' : 'solid'];
      return { color: textColor };
    }
    const { color: textColor } = foundColor.default[outline ? 'outline' : 'solid'];
    return { color: textColor };
  }, [color, ctx?.colors, disabled, outline]);

  return (
    <Container ref={outerRef} style={containerStyle} onLayout={onLayout}>
      <TouchableHighlight
        underlayColor={'transparent'}
        activeOpacity={1}
        onShowUnderlay={() => setShowingUnderlay(true)}
        onHideUnderlay={() => setShowingUnderlay(false)}
        onPress={(e) => !loading && !disabled && onPress && onPress(e)}>
        <ButtonBox {...rest} style={[buttonColorStyles, rest?.style]}>
          {loading ? (
            <ActivityIndicator
              size={loadingSize || 'small'}
              color={activityIndicatorColor ? activityIndicatorColor : buttonTextColorStyles.color}
            />
          ) : typeof children === 'string' ? (
            <ButtonText style={[buttonTextColorStyles]}>{children}</ButtonText>
          ) : (
            children
          )}
        </ButtonBox>
      </TouchableHighlight>
    </Container>
  );
};

const Button: ButtonComponent = React.forwardRef<View, ButtonProps>((props, ref) => (
  <Component outerRef={ref} {...props} />
));

export default memo(Button);
