import React, { useCallback, useState, useRef, useEffect } from 'react';
import { Animated, ViewStyle, GestureResponderEvent, LayoutChangeEvent, LayoutRectangle } from 'react-native';

import { actionCreators } from './redux/actions';
import { ToastState } from './redux/types';
import { Container, InfoMessage, ErrorMessage, WarningMessage, MessageText } from './styles';

export type CustomProps = {
  containerStyle?: ViewStyle;
  duration?: number;
};

export type ToastProps = CustomProps & ToastState & typeof actionCreators;

const Toast: React.FC<ToastProps> = ({
  message,
  error,
  warning,
  containerStyle,
  duration,
  reseter,
  hide: reduxHide,
}) => {
  // Refs
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const shadowOpacity = useRef(new Animated.Value(0)).current;
  const translationX = useRef(new Animated.Value(0)).current;
  const translationY = useRef(new Animated.Value(0)).current;
  const timeoutHandler = useRef(null);

  // States
  const [lastReseter, setLastReseter] = useState<boolean>();
  const [canShow, setCanShow] = useState<boolean>(false);
  const [startTimeoutTime, setStartTimeoutTime] = useState<number>();
  const [stoppedTimeoutTime, setStoppedTimeoutTime] = useState<number>();
  const [initialPosition, setInitialPosition] = useState<{ pageX: number; pageY: number }>();
  const [layout, setLayout] = useState<LayoutRectangle>({
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  });

  const getFadeAnimation = useCallback(
    (opening?: boolean) =>
      Animated.parallel([
        Animated.timing(fadeAnimation, { toValue: +opening, duration: 350, useNativeDriver: true }),
        Animated.timing(shadowOpacity, { toValue: +opening, duration: 350, useNativeDriver: true }),
      ]),
    [fadeAnimation, shadowOpacity],
  );

  const doClearTimeout = useCallback(() => {
    if (timeoutHandler?.current) {
      clearTimeout(timeoutHandler?.current);
      timeoutHandler.current = null;
    }
  }, []);

  const stopTimeout = useCallback(() => {
    const now = new Date();
    setStoppedTimeoutTime(now.getTime());
    doClearTimeout();
  }, [doClearTimeout]);

  const doHide = useCallback(() => {
    reduxHide();
    doClearTimeout();
    translationX.setValue(0);
    translationY.setValue(0);
    setCanShow(false);
  }, [reduxHide, doClearTimeout, translationX, translationY]);

  const hide = useCallback(
    (doAnimation?: boolean) => {
      if (doAnimation) {
        getFadeAnimation(false).start(doHide);
      } else {
        doHide();
      }
    },
    [doHide, getFadeAnimation],
  );

  const startTimeout = useCallback(
    (time: number = duration) => {
      const now = new Date();
      setStartTimeoutTime(now?.getTime());
      setStoppedTimeoutTime(null);
      timeoutHandler.current = setTimeout(() => {
        hide(true);
        setStartTimeoutTime(null);
        setStoppedTimeoutTime(null);
      }, time);
    },
    [duration, hide],
  );

  const resumeTimeout = useCallback(() => {
    let timeoutTimeLeft = 0;
    if (stoppedTimeoutTime && startTimeoutTime) {
      timeoutTimeLeft = (stoppedTimeoutTime || 0) - (startTimeoutTime || 0);
    }
    timeoutTimeLeft = Math.max(timeoutTimeLeft, 100);
    startTimeout(timeoutTimeLeft);
  }, [startTimeout, startTimeoutTime, stoppedTimeoutTime]);

  const resetTimeout = useCallback(() => {
    doClearTimeout();
    startTimeout();
  }, [startTimeout, doClearTimeout]);

  const show = useCallback(() => {
    setCanShow(true);
    translationX.setValue(0);
    translationY.setValue(0);
    resetTimeout();

    getFadeAnimation(true).start();
  }, [translationX, translationY, resetTimeout, getFadeAnimation]);

  useEffect(() => {
    if (reseter === lastReseter) {
      return;
    }
    setLastReseter(reseter);
    show();
    // The "reseter" dependency is mandatory here to ensure that every time
    // you fire a toast the show will be triggered too, so we prevent it from
    // ending up not opening, as you have not changed any of the other dependencies.
  }, [lastReseter, reseter, show]);

  const onTouchMove = useCallback(
    (event: GestureResponderEvent) => {
      stopTimeout();

      const { pageY, pageX } = event?.nativeEvent;

      const movedX = pageX - initialPosition?.pageX;
      const movedY = pageY - initialPosition?.pageY;

      translationX?.setValue(movedX);
      translationY?.setValue(movedY);
    },
    [stopTimeout, initialPosition?.pageX, initialPosition?.pageY, translationX, translationY],
  );

  const onTouchStart = (e?: GestureResponderEvent) => {
    const { pageX, pageY } = e?.nativeEvent;
    setInitialPosition({ pageX, pageY });
  };

  const animateToInitialPosition = () => {
    Animated.parallel([
      Animated.timing(translationX, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(translationY, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getDissmissAnimation = useCallback(
    (x: number, y: number) =>
      Animated.parallel([
        Animated.timing(translationX, {
          toValue: x,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(translationY, {
          toValue: y,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnimation, { toValue: 0, duration: 350, useNativeDriver: true }),
        Animated.timing(shadowOpacity, { toValue: 0, duration: 350, useNativeDriver: true }),
      ]),
    [fadeAnimation, shadowOpacity, translationX, translationY],
  );

  const animateDissmiss = (cardianX: number, cardianY: number) => {
    //          ┬ Y
    // (-x, y)  │   (x, y)
    //          │ ┌>Tolerance Shape
    //       ┌──┼──┐
    // ├─────┼──┼──┼─────┤ X
    //       └──┼──┘
    //          │
    // (-x, -y) │  (x, -y)
    //          ┴
    const toleranceShape = {
      x: {
        positive: 50,
        negative: -50,
      },
      y: {
        positive: 30,
        negative: -30,
      },
    };

    const xIsInsideToleranceBox = cardianX < toleranceShape?.x?.positive && cardianX > toleranceShape?.x?.negative;
    const yIsInsideToleranceBox = cardianY < toleranceShape?.y?.positive && cardianY > toleranceShape?.y?.negative;
    const fullyInsideToleranceBox = xIsInsideToleranceBox && yIsInsideToleranceBox;

    if (fullyInsideToleranceBox) {
      // As long as the offset is less than the movement limit to dissmiss the message,
      // we must return it to the initial position
      animateToInitialPosition();
      resumeTimeout();
    }

    let animation: Animated.CompositeAnimation;

    const defaultValue = layout?.height * layout?.width;
    const parseCardianYToTranslationY = (valY) => -valY;

    // Top
    if (xIsInsideToleranceBox && cardianY > toleranceShape?.y?.positive) {
      animation = getDissmissAnimation(0, parseCardianYToTranslationY(defaultValue));
    }
    // Right
    if (yIsInsideToleranceBox && cardianX > toleranceShape?.x?.positive) {
      animation = getDissmissAnimation(defaultValue, 0);
    }
    // Left
    if (yIsInsideToleranceBox && cardianX < toleranceShape?.x?.negative) {
      animation = getDissmissAnimation(-defaultValue, 0);
    }
    // Top Right
    if (cardianX > toleranceShape?.x?.positive && cardianY > toleranceShape?.y?.positive) {
      animation = getDissmissAnimation(defaultValue, parseCardianYToTranslationY(defaultValue));
    }
    // Top Left
    if (cardianX < toleranceShape?.x?.negative && cardianY > toleranceShape?.y?.positive) {
      animation = getDissmissAnimation(-defaultValue, parseCardianYToTranslationY(defaultValue));
    }
    // Bottom
    if (xIsInsideToleranceBox && cardianY < toleranceShape?.y?.negative) {
      animateToInitialPosition();
      resumeTimeout();
    }
    // Bottom Right
    if (cardianX > toleranceShape?.x?.positive && cardianY < toleranceShape?.y?.negative) {
      animation = getDissmissAnimation(defaultValue, parseCardianYToTranslationY(-defaultValue));
    }
    // Bottom Left
    if (cardianX < toleranceShape?.x?.negative && cardianY < toleranceShape?.y?.negative) {
      animation = getDissmissAnimation(-defaultValue, parseCardianYToTranslationY(-defaultValue));
    }

    animation?.start(() => hide());
  };

  const onTouchEnd = (e?: GestureResponderEvent) => {
    const { pageX, pageY } = e?.nativeEvent;
    const movedX = pageX - initialPosition?.pageX;
    const movedY = pageY - initialPosition?.pageY;

    animateDissmiss(movedX, -movedY);
  };

  const handleOnLayout = (e: LayoutChangeEvent) => {
    setLayout(e?.nativeEvent?.layout);
  };

  return (
    !!canShow &&
    !!message && (
      <Container
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onLayout={handleOnLayout}
        style={[
          {
            opacity: fadeAnimation,
            shadowOpacity: shadowOpacity,
            transform: [
              {
                translateX: translationX,
                translateY: translationY,
              },
            ],
          },
        ]}>
        {!error && !warning && (
          <InfoMessage style={containerStyle}>
            <MessageText>{message}</MessageText>
          </InfoMessage>
        )}
        {error && (
          <ErrorMessage style={containerStyle}>
            <MessageText>{message}</MessageText>
          </ErrorMessage>
        )}
        {warning && (
          <WarningMessage style={containerStyle}>
            <MessageText>{message}</MessageText>
          </WarningMessage>
        )}
      </Container>
    )
  );
};

export default Toast;
