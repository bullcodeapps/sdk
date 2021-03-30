import React, { useState, useImperativeHandle, useMemo, useCallback, memo } from 'react';
import { ToastComponentProps, ActionTypeEnum, ToastState, ToastProviderProps, ToastColors } from './types';
import ToastComponent from './Toast';
import { globalToastActions } from '@bullcode/mobile/components/Toast';

// export const Context = React.createContext<ToastComponentProps>(null);

export const TOAST_DEFAULT_TIMEOUT = 4000;

export const DEFAULT_TOAST_COLORS: ToastColors = {
  info: {
    backgroundColor: '#2abb9b',
    color: '#ffffff',
  },
  warning: {
    backgroundColor: '#f39c12',
    color: '#ffffff',
  },
  error: {
    backgroundColor: '#d64541',
    color: '#ffffff',
  },
};

export const INITIAL_STATE: ToastState = {
  message: null,
  timeout: TOAST_DEFAULT_TIMEOUT,
  actionType: ActionTypeEnum.DISPLAY_INFO,
  visibility: false,
  reseter: false,
  colors: DEFAULT_TOAST_COLORS,
};

export const ToastProvider = memo(
  React.forwardRef(({ colors: propColors = INITIAL_STATE.colors }: ToastProviderProps, ref) => {
    const [state, setState] = useState<ToastState>({ ...INITIAL_STATE, colors: propColors });

    const hide = useCallback(() => {
      setState((oldState) => {
        const immutableData = {
          reseter: oldState?.reseter,
          colors: oldState?.colors,
        };
        return { ...INITIAL_STATE, actionType: ActionTypeEnum.HIDE, ...immutableData };
      });
    }, []);

    const providerValue: ToastComponentProps = useMemo(
      () => ({
        getState: () => state,
        displayInfo: (
          message,
          timeout = TOAST_DEFAULT_TIMEOUT,
          style = { backgroundColor: state?.colors?.info?.backgroundColor },
          textStyle = { color: state?.colors?.info?.color },
        ) =>
          setState((oldState) => ({
            ...oldState,
            message,
            timeout,
            actionType: ActionTypeEnum.DISPLAY_INFO,
            reseter: !state?.reseter,
            visibility: true,
            style,
            textStyle,
          })),
        displayWarning: (
          message,
          timeout = TOAST_DEFAULT_TIMEOUT,
          style = { backgroundColor: state?.colors?.warning?.backgroundColor },
          textStyle = { color: state?.colors?.warning?.color },
        ) =>
          setState((oldState) => ({
            ...oldState,
            message,
            timeout,
            actionType: ActionTypeEnum.DISPLAY_WARNING,
            reseter: !state?.reseter,
            visibility: true,
            style,
            textStyle,
          })),
        displayError: (
          message,
          timeout = TOAST_DEFAULT_TIMEOUT,
          style = { backgroundColor: state?.colors?.error?.backgroundColor },
          textStyle = { color: state?.colors?.error?.color },
        ) =>
          setState((oldState) => ({
            ...oldState,
            message,
            timeout,
            actionType: ActionTypeEnum.DISPLAY_ERROR,
            reseter: !state?.reseter,
            visibility: true,
            style,
            textStyle,
          })),
        setColors: (colors: ToastColors) =>
          setState((oldState) => ({
            ...oldState,
            colors,
          })),
        hide,
      }),
      [hide, state],
    );

    useImperativeHandle(ref, () => providerValue);

    return <ToastComponent {...state} hide={hide} />;
  }),
);

// Hooks
// We can't use the context here, because it slows down performance!
export const useToast = (): ToastComponentProps => globalToastActions;
