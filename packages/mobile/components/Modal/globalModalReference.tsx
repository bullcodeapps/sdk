import React from 'react';
import { ModalComponentProps, ModalState } from '@bullcode/mobile/components/Modal/types';

export const globalModalRef = React.createRef<ModalComponentProps>();
const getRef = (): ModalComponentProps => globalModalRef?.current;

type GlobalModalActions = Omit<ModalComponentProps, 'state'> & {
  getState: () => ModalState;
};

const globalModalActions: GlobalModalActions = {
  show: (component, config) => getRef().show(component, config),
  hide: () => getRef().hide(),
  getState: () => getRef().getState(),
};

export default globalModalActions;
