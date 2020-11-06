import React, { useCallback, useEffect, useState } from 'react';
import { Animated, ViewStyle, Dimensions } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

import { actionCreators as toastActions } from './redux/actions';
import { Container, InfoMessage, ErrorMessage, WarningMessage, MessageText } from './styles';

export type ToastProps = {
  containerStyle?: ViewStyle;
  message?: string;
  error?: boolean;
  warning?: boolean;
  duration?: number;
  dispatch?: Function;
};

type ShowFnProps = {
  showError: boolean;
  showWarning: boolean;
  showDismissTimeout: ReturnType<typeof setTimeout>;
};

const Toast: React.FC<ToastProps> = ({
  containerStyle,
  message: messageProps,
  error: errorProps,
  duration,
  warning: warningProps,
  dispatch,
}) => {
  const [fadeAnimation] = useState(new Animated.Value(0));
  const [shadowOpacity] = useState(new Animated.Value(0));
  const [translationX] = useState(new Animated.Value(0));
  const [translationY] = useState(new Animated.Value(0));
  const [present, setPresent] = useState(false);
  const [error, setError] = useState(false);
  const [warning, setWarning] = useState(false);
  const [message, setMessage] = useState('');
  const [dismissTimeout, setDismissTimeout] = useState(null);

  const show = useCallback(
    (showMessage, { showError, showWarning, showDismissTimeout }: ShowFnProps) => {
      setPresent(true);
      setMessage(showMessage);
      setError(showError);
      setWarning(showWarning);
      setDismissTimeout(showDismissTimeout);

      Animated.timing(fadeAnimation, { toValue: 1, useNativeDriver: true }).start();
      Animated.timing(shadowOpacity, { toValue: 1, useNativeDriver: true }).start();
    },
    [fadeAnimation, shadowOpacity],
  );

  const hide = useCallback(() => {
    Animated.timing(shadowOpacity, { toValue: 0, useNativeDriver: true }).start();
    Animated.timing(fadeAnimation, { toValue: 0, useNativeDriver: true }).start(() => {
      setPresent(false);
      setMessage(null);
      setError(false);
      setWarning(false);
      setDismissTimeout(null);
      translationX.setValue(0);
      translationY.setValue(0);
    });
  }, [fadeAnimation, shadowOpacity, translationX, translationY]);

  useEffect(() => {
    if (messageProps) {
      const timeout = setTimeout(() => {
        dispatch(toastActions.hide());
      }, duration);
      show(messageProps, { showError: errorProps, showWarning: warningProps, showDismissTimeout: timeout });
    } else {
      hide();
    }
  }, [dispatch, duration, errorProps, hide, messageProps, show, warningProps]);

  useEffect(() => {
    clearTimeout(dismissTimeout);
  }, [messageProps, errorProps, duration, warningProps]); //eslint-disable-line

  const onHandlerStateChange = useCallback(
    (event) => {
      clearTimeout(dismissTimeout);

      if (event.nativeEvent.oldState === State.ACTIVE) {
        const { translationY: currentTranslationY, translationX: currentTranslationX } = event.nativeEvent;

        if (currentTranslationY < -20) {
          hide();
        } else {
          translationY.setValue(0);
          translationY.setOffset(0);
        }

        const timeout = setTimeout(() => {
          dispatch(toastActions.hide());
        }, duration);

        if (currentTranslationX <= -240) {
          setDismissTimeout(timeout);
          return hide();
        } else if (currentTranslationX > -240 && currentTranslationX <= Dimensions.get('window').width / 2) {
          translationX.setValue(0);
          translationX.setOffset(0);
          setDismissTimeout(timeout);
        }

        if (currentTranslationX >= 240) {
          setDismissTimeout(timeout);
          return hide();
        } else {
          translationX.setValue(0);
          translationX.setOffset(0);
          setDismissTimeout(timeout);
        }
      }
    },
    [dismissTimeout, dispatch, duration, hide, translationX, translationY],
  );

  if (!present) {
    return null;
  }

  return (
    <PanGestureHandler
      onGestureEvent={Animated.event(
        [
          {
            nativeEvent: {
              translationX,
              translationY,
            },
          },
        ],
        { useNativeDriver: true },
      )}
      onHandlerStateChange={onHandlerStateChange}>
      <Container
        style={[
          {
            opacity: fadeAnimation,
            shadowOpacity: shadowOpacity,
            transform: [
              {
                translateX: translationX,
                translateY: translationY.interpolate({
                  inputRange: [0, 50],
                  outputRange: [0, 5],
                  extrapolate: 'clamp',
                }),
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
    </PanGestureHandler>
  );
};

export default Toast;
