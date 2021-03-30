import React, { useState, useCallback, useImperativeHandle } from 'react';

import { Container } from '@bullcode/mobile/components/Modal/styles';
import {
  ModalComponentProps,
  ModalConfig,
  ModalAnimationEnum,
  ModalState,
} from '@bullcode/mobile/components/Modal/types';
import ModalContainer from '@bullcode/mobile/components/Modal/ModalContainer';
import globalModalActions from './globalModalReference';

export const ModalContext = React.createContext<ModalComponentProps>(null);

const DEFAULT_CONFIG = {
  animation: ModalAnimationEnum.EASE,
  backdropColor: null,
  exitOnBackdrop: null,
};

const INITIAL_STATE: ModalState = {
  component: null,
  config: DEFAULT_CONFIG,
  visibility: false,
};

export const ModalProvider = React.forwardRef((props, ref) => {
  const [state, setState] = useState(INITIAL_STATE);

  const hide = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const providerValue: ModalComponentProps = {
    getState: () => state,
    show: (component: any, config: ModalConfig) => {
      setState({ component, config, visibility: true });
    },
    hide,
  };

  useImperativeHandle(ref, () => providerValue);

  return (
    !!state?.visibility && (
      <Container>
        <ModalContainer visible={!!state?.visibility} config={state?.config} onClose={hide}>
          {state?.component}
        </ModalContainer>
      </Container>
    )
  );
});

// Hook
// We can't use the context here, because it slows down performance!
export const useModal = (): ModalComponentProps => globalModalActions;
