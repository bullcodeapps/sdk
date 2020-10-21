import React, { memo } from 'react';

import { AvailableColors, getButtonColor, Container, ButtonBox, ButtonText } from './styles';
import {
  GestureResponderEvent,
  ActivityIndicator,
  ViewStyle,
  ViewProps,
  TouchableOpacity,
  View,
} from 'react-native';

export type ButtonProps = {
  ref?: React.Ref<View>;
  outerRef?: React.Ref<View>;
  disabled?: boolean;
  outline?: boolean;
  loading?: boolean;
  loadingSize?: number | 'small' | 'large';
  children?: any;
  activityIndicatorColor?: string;
  color?: AvailableColors;
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
}: ButtonProps) => (
  <Container ref={outerRef} style={containerStyle} onLayout={onLayout}>
    <TouchableOpacity
      onPress={(e) => !loading && !disabled && onPress && onPress(e)}
      activeOpacity={activeOpacity || 0.8}>
      <ButtonBox disabled={disabled} outline={outline} color={color} {...rest}>
        {loading ? (
          <ActivityIndicator
            size={loadingSize || 'small'}
            color={activityIndicatorColor ? activityIndicatorColor : getButtonColor({ color, outline })}
          />
        ) : typeof children === 'string' ? (
          <ButtonText disabled={disabled} outline={outline} color={color}>
            {children}
          </ButtonText>
        ) : (
          children
        )}
      </ButtonBox>
    </TouchableOpacity>
  </Container>
);

const Button: ButtonComponent = React.forwardRef<View, ButtonProps>((props, ref) => (
  <Component outerRef={ref} {...props} />
));

export default memo(Button);
