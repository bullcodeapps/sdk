import React, { Component } from 'react';
import { Animated, TextProps, ViewStyle } from 'react-native';

import { actionCreators as toastActions } from './redux/actions';
import { Container, InfoMessage, ErrorMessage, WarningMessage, MessageText } from './styles';

export type ToastProps = {
  containerStyle?: ViewStyle;
  message?: string;
  messageStyle?: TextProps;
  error?: boolean;
  errorStyle?: ViewStyle;
  warning?: boolean;
  warningStyle?: ViewStyle;
  duration?: number;
  getMessageComponent?: Function;
  dispatch?: Function;
};

export type ToastState = {
  error?: boolean;
  warning?: boolean;
  fadeAnimation: Animated.Value;
  shadowOpacity: Animated.Value;
  present: boolean;
  message: string;
  dismissTimeout: number;
};

export default class Toast extends Component<ToastProps, ToastState> {
  state: ToastState = {
    fadeAnimation: new Animated.Value(0),
    shadowOpacity: new Animated.Value(0),
    present: false,
    message: '',
    dismissTimeout: null,
  };

  // static async getDerivedStateFromProps(props, state) {
  //   if (props.message) {
  //     const dismissTimeout = setTimeout(() => {
  //       props.dispatch(toastActions.hide());
  //     }, props.duration);
  //     clearTimeout(state.dismissTimeout);
  //     const animationPromise = new Promise((resolve) => {
  //       Animated.sequence([
  //         Animated.timing(state.fadeAnimation, { toValue: 1 }),
  //         Animated.timing(state.shadowOpacity, { toValue: 0.5 }),
  //       ]).start(() => {
  //         resolve({
  //           present: true,
  //           fadeAnimation: new Animated.Value(0),
  //           shadowOpacity: new Animated.Value(0),
  //           message: props.message,
  //           error: props.error,
  //           warning: props.warning,
  //           dismissTimeout,
  //         });
  //       });
  //     });

  //     return await animationPromise;
  //   } else {
  //     const animationPromise: Promise<Object> = new Promise((resolve) => {
  //       Animated.timing(state.shadowOpacity, { toValue: 0 }).start();
  //       Animated.timing(state.fadeAnimation, { toValue: 0 }).start(() => {
  //         resolve({ present: false, message: null, error: false, warning: false, dismissTimeout: null });
  //       });
  //     });
  //     return await animationPromise;
  //   }
  // }

  componentWillReceiveProps({ message, error, duration, warning }) {
    if (message) {
      const dismissTimeout = setTimeout(() => {
        this.props.dispatch(toastActions.hide());
      }, duration);
      clearTimeout(this.state.dismissTimeout);
      this.show(message, { error, warning, dismissTimeout });
    } else {
      this.hide();
    }
  }

  show(message, { error, warning, dismissTimeout }) {
    this.setState(
      {
        present: true,
        fadeAnimation: new Animated.Value(0),
        shadowOpacity: new Animated.Value(0),
        message,
        error,
        warning,
        dismissTimeout,
      },
      () => {
        Animated.timing(this.state.fadeAnimation, { toValue: 1, useNativeDriver: true }).start();
        Animated.timing(this.state.shadowOpacity, { toValue: 0.5, useNativeDriver: true }).start();
      },
    );
  }

  hide() {
    Animated.timing(this.state.shadowOpacity, { toValue: 0, useNativeDriver: true }).start();
    Animated.timing(this.state.fadeAnimation, { toValue: 0, useNativeDriver: true }).start(() => {
      this.setState({ present: false, message: null, error: false, warning: false, dismissTimeout: null });
    });
  }

  render() {
    if (!this.state.present) {
      return null;
    }

    return (
      <Container style={[{ opacity: this.state.fadeAnimation, shadowOpacity: this.state.shadowOpacity }]}>
        {!this.state.error && !this.state.warning && (
          <InfoMessage style={this.props.containerStyle}>
            <MessageText>{this.state.message}</MessageText>
          </InfoMessage>
        )}
        {this.state.error && (
          <ErrorMessage style={this.props.containerStyle}>
            <MessageText>{this.state.message}</MessageText>
          </ErrorMessage>
        )}
        {this.state.warning && (
          <WarningMessage style={this.props.containerStyle}>
            <MessageText>{this.state.message}</MessageText>
          </WarningMessage>
        )}
      </Container>
    );
  }
}
