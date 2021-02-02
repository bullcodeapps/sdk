import React, { useState, useMemo, useCallback, ComponentType } from 'react';

import { Container, AnimatedView } from './styles';
import {
  TapGestureHandlerStateChangeEvent,
  LongPressGestureHandler,
  LongPressGestureHandlerStateChangeEvent,
  State,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import { Animated, View, Platform, ViewStyle } from 'react-native';

export type TouchableProps = {
  activeOpacity?: number;
  children?: any;
  onPress?: (e: TapGestureHandlerStateChangeEvent) => void;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
} & Animated.AnimatedComponent<ComponentType<View>>;

export const Touchable: React.FC<TouchableProps> = ({
  activeOpacity: propActiveOpacity,
  children,
  onPress,
  style,
  contentContainerStyle,
  ...rest
}) => {
  const [activeOpacityAnimValue] = useState(new Animated.Value(1));

  const activeOpacity = useMemo(() => (!isNaN(propActiveOpacity) ? propActiveOpacity : 0.5), [propActiveOpacity]);

  const handlerLongPressStateChange = (e: LongPressGestureHandlerStateChangeEvent) => {
    if (e.nativeEvent.state === State.ACTIVE) {
      Animated.timing(activeOpacityAnimValue, {
        toValue: activeOpacity,
        duration: 50,
        useNativeDriver: true,
      }).start();
    }
    if (e.nativeEvent.state === State.END) {
      Animated.timing(activeOpacityAnimValue, {
        toValue: activeOpacity,
        duration: 50,
        useNativeDriver: true,
      }).start(() => {
        onPress && onPress(e);
      });
    }
  };

  const doActiveOpacityAnimation = useCallback(
    (callbackFn: Animated.EndCallback) => {
      Animated.sequence([
        Animated.timing(activeOpacityAnimValue, {
          toValue: activeOpacity,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(activeOpacityAnimValue, {
          toValue: 1,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start(callbackFn);
    },
    [activeOpacity, activeOpacityAnimValue],
  );

  const handlerTapStateChange = (e) => {
    doActiveOpacityAnimation(() => {
      onPress && onPress(e);
    });
  };

  return Platform.OS === 'ios' ? (
    <Container>
      <LongPressGestureHandler minDurationMs={0} onHandlerStateChange={handlerLongPressStateChange}>
        <AnimatedView
          style={[
            {
              opacity: activeOpacityAnimValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            },
            contentContainerStyle,
          ]}
          {...rest}>
          {children}
        </AnimatedView>
      </LongPressGestureHandler>
    </Container>
  ) : (
      <Container>
        <TapGestureHandler onHandlerStateChange={handlerTapStateChange}>
          <AnimatedView
            style={[
              {
                opacity: activeOpacityAnimValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              },
              contentContainerStyle,
            ]}
            {...rest}>
            {children}
          </AnimatedView>
        </TapGestureHandler>
      </Container>
    );
};

export default Touchable;
