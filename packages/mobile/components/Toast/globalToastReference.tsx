import React from 'react';
import { ToastComponentProps, ToastState, ToastColors } from './types';

export const globalToastRef = React.createRef<ToastComponentProps>();
const getRef = (): ToastComponentProps => globalToastRef?.current;

type GlobalToastActions = Omit<ToastComponentProps, 'state'> & {
  getState: () => ToastState;
};

const globalToastActions: GlobalToastActions = {
  displayInfo: (message, timeout) => getRef().displayInfo(message, timeout),
  displayWarning: (message, timeout) => getRef().displayWarning(message, timeout),
  displayError: (message, timeout) => getRef().displayError(message, timeout),
  hide: () => getRef().hide(),
  getState: () => getRef().getState(),
  setColors: (colors: ToastColors) => getRef().setColors(colors),
};

export default globalToastActions;
