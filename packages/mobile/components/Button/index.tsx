import React, { memo, useContext, useMemo, useState } from 'react';

import { Container, ButtonBox } from './styles';
import { GestureResponderEvent, ViewStyle, ViewProps, TouchableHighlight, View } from 'react-native';
import { ButtonStyle } from '@bullcode/mobile/components/Button/types';
import ButtonContext, {
  ButtonContextType,
  DEFAULT_BUTTON_STYLES,
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
  theme?: string;
  contentContainerStyle?: ViewStyle;
  buttonTextStyle?: ViewStyle;
  textStyle?: string;
  onPress?: (event: GestureResponderEvent) => void;
} & ViewProps;

export type ButtonComponent = React.FC<ButtonProps>;

const Component: ButtonComponent = ({
  outerRef,
  disabled,
  outline,
  theme,
  activityIndicatorColor,
  loading,
  loadingSize,
  children,
  contentContainerStyle,
  buttonTextStyle,
  textStyle,
  onPress,
  onLayout,
  ...rest
}: ButtonProps) => {
  const ctx = useContext<ButtonContextType>(ButtonContext);

  const [showingUnderlay, setShowingUnderlay] = useState<boolean>(false);

  const foundStyle: ButtonStyle = useMemo(() => {
    const styles = ctx?.styles || DEFAULT_BUTTON_STYLES;
    return styles.find((_style) => _style.name === theme);
  }, [ctx?.styles, theme]);

  const buttonActiveStyle: ViewStyle = useMemo(() => {
    if (!foundStyle) {
      console.log(
        `The theme "${theme}" has no styles defined for the active state, check if the theme of the button is the desired one or if this theme has actually been declared previously`,
      );
      return;
    }
    if (disabled) {
      const { buttonStyle } = foundStyle?.disabled[outline ? 'outline' : 'solid'];
      return buttonStyle;
    }
    const { buttonStyle } = foundStyle?.active[outline ? 'outline' : 'solid'];
    return buttonStyle;
  }, [foundStyle, disabled, outline, theme]);

  const buttonStyles: Partial<ButtonStyle> = useMemo(() => {
    if (!foundStyle) {
      console.log(
        `The "${theme}" theme does not exist, check if you wrote it correctly or if it was declared previously`,
      );
      return {};
    }

    const { buttonStyle } = foundStyle.default[outline ? 'outline' : 'solid'];
    const borderRadius = foundStyle?.borderRadius;
    if (showingUnderlay) {
      return {
        ...buttonStyle,
        ...buttonActiveStyle,
        borderRadius,
      };
    }

    if (disabled) {
      const { buttonStyle: btnStyle } = foundStyle?.disabled[outline ? 'outline' : 'solid'];
      return { ...btnStyle, borderRadius };
    }
    return { ...buttonStyle, borderRadius };
  }, [foundStyle, outline, showingUnderlay, disabled, theme, buttonActiveStyle]);

  return (
    <Container ref={outerRef} onLayout={onLayout} {...rest} style={[buttonStyles, rest?.style]}>
      <TouchableHighlight
        style={{ flexGrow: 1, width: '100%', height: '100%' }}
        underlayColor={'transparent'}
        activeOpacity={1}
        onShowUnderlay={() => setShowingUnderlay(true)}
        onHideUnderlay={() => setShowingUnderlay(false)}
        onPress={(e) => !loading && !disabled && onPress && onPress(e)}>
        <ButtonBox style={contentContainerStyle}>
          {typeof children === 'string' ? (
            <ButtonText
              activityIndicatorColor={activityIndicatorColor}
              theme={theme}
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
