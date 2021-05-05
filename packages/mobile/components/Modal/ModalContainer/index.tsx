import React, { useState, useCallback, useEffect, memo } from 'react';
import { Animated } from 'react-native';
import { ModalAnimationEnum, ModalConfig } from '../types';
import { Container, Content, Backdrop, AnimatedModalWindow, WindowContent } from './styles';

export type ModalContainerProps = {
  visible?: boolean;
  config: ModalConfig;
  children: React.ReactNode;
  onClose?: () => void;
};

export const ModalContainer: React.FC<ModalContainerProps> = ({ visible, config, children, onClose }) => {
  const [windowEaseAnim] = useState(new Animated.Value(0));
  const [windowBounceAnim] = useState(new Animated.Value(0));

  const handleAnimation = useCallback(() => {
    if (config?.animation === ModalAnimationEnum.NONE) {
      return;
    }

    const speed = config?.animationSpeed || 0.5;
    if (config?.animation === ModalAnimationEnum.BOUNCE) {
      windowBounceAnim.setValue(0);
      Animated.timing(windowBounceAnim, {
        toValue: 4,
        delay: 500 * speed,
        duration: 200 * speed,
        useNativeDriver: true,
      }).start();
      setTimeout(() => {
        Animated.timing(windowBounceAnim, {
          toValue: 1,
          duration: 200 * speed,
          useNativeDriver: true,
        }).start();
      }, 700 * speed);
      setTimeout(() => {
        Animated.timing(windowBounceAnim, {
          toValue: 3,
          duration: 200 * speed,
          useNativeDriver: true,
        }).start();
      }, 900 * speed);
      setTimeout(() => {
        Animated.timing(windowBounceAnim, {
          toValue: 2,
          duration: 200 * speed,
          useNativeDriver: true,
        }).start();
      }, 1100 * speed);
      return;
    }
    windowEaseAnim.setValue(0);
    Animated.timing(windowEaseAnim, {
      toValue: 1,
      duration: 225 * speed,
      useNativeDriver: true,
    }).start();
  }, [config?.animation, config?.animationSpeed, windowBounceAnim, windowEaseAnim]);

  useEffect(() => {
    if (visible) {
      handleAnimation();
    }
  }, [handleAnimation, visible]);

  const getAnimationInterpolation = () => {
    if (config?.animation === ModalAnimationEnum.BOUNCE) {
      return windowBounceAnim.interpolate({
        inputRange: [0, 1, 2, 3, 4],
        outputRange: [0.8, 0.95, 1, 1.05, 1.1],
      });
    }
    return windowEaseAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1],
    });
  };

  return (
    <Container>
      <Backdrop
        color={config?.backdropColor}
        activeOpacity={config?.exitOnBackdrop ? 0.8 : 1}
        onPress={() => {
          if (config?.exitOnBackdrop) {
            onClose && onClose();
          }
        }}
      />
      <Content fullScreen={config?.fullScreen}>
        <AnimatedModalWindow
          fullScreen={config?.fullScreen}
          style={
            config?.animation !== ModalAnimationEnum.NONE
              ? {
                transform: [
                  {
                    scale: getAnimationInterpolation(),
                  },
                ],
              }
              : null
          }>
          <Backdrop
            color="transparent"
            onPress={() => {
              if (config?.exitOnBackdrop) {
                onClose && onClose();
              }
            }}
          />
          <WindowContent>{children ? children : null}</WindowContent>
        </AnimatedModalWindow>
      </Content>
    </Container>
  );
};

export default memo(ModalContainer);
