import React, { memo, useContext, useMemo, useState } from 'react';

import { Container, ButtonBox } from './styles';
import { GestureResponderEvent, ViewStyle, ViewProps, TouchableHighlight, View } from 'react-native';
import { LightenDarkenColor } from '@bullcode/core/utils';
import { ButtonStyles } from '@bullcode/mobile/components/Button/types';
import ButtonContext, {
  ButtonContextType,
  DEFAULT_BUTTON_COLORS,
} from '@bullcode/mobile/components/Button/context';
import ButtonText from './ButtonText';

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
  contentContainerStyle?: ViewStyle;
  onPress?: (event: GestureResponderEvent) => void;
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
  contentContainerStyle,
  onPress,
  onLayout,
  ...rest
}: ButtonProps) => {
  const ctx = useContext<ButtonContextType>(ButtonContext);

  const [showingUnderlay, setShowingUnderlay] = useState<boolean>(false);

  const buttonUnderlayStyle: ViewStyle = useMemo(() => {
    const colors = ctx?.colors || DEFAULT_BUTTON_COLORS;
    const foundColor = colors.find((_color) => _color.name === color);
    if (!foundColor) {
      console.log(
        `The color "${color}" has no colors defined for the active state, check if the color of the button is the desired one or if this color has actually been declared previously`,
      );
      return;
    }
    if (disabled) {
      return foundColor?.disabled[outline ? 'outline' : 'solid'];
    }
    return foundColor?.active[outline ? 'outline' : 'solid'];
  }, [color, ctx?.colors, disabled, outline]);

  const buttonColorStyles: Partial<ButtonStyles> = useMemo(() => {
    const colors = ctx?.colors || DEFAULT_BUTTON_COLORS;
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
      return {
        ...buttonStyles,
        ...buttonUnderlayStyle,
        borderRadius,
      };
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
  }, [buttonUnderlayStyle, color, ctx?.colors, disabled, outline, showingUnderlay]);

  return (
    <Container ref={outerRef} onLayout={onLayout} {...rest} style={[buttonColorStyles, rest?.style]}>
      <TouchableHighlight
        style={{ flexGrow: 1 }}
        underlayColor={'transparent'}
        activeOpacity={1}
        onShowUnderlay={() => setShowingUnderlay(true)}
        onHideUnderlay={() => setShowingUnderlay(false)}
        onPress={(e) => !loading && !disabled && onPress && onPress(e)}>
        <ButtonBox style={contentContainerStyle}>
          {typeof children === 'string' ? (
            <ButtonText
              activityIndicatorColor={activityIndicatorColor}
              color={color}
              defaultButtonColors={DEFAULT_BUTTON_COLORS}
              loading={loading}
              loadingSize={loadingSize}
              disabled={disabled}
              outline={outline}>
              {children}
            </ButtonText>
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
