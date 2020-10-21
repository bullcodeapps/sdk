import React, { useState, useEffect, useContext } from 'react';

import { Container } from './styles';
import { ModalComponent, ModalConfig, ModalAnimationEnum } from './types';
import ModalContainer from './ModalContainer';

export const ModalContext = React.createContext<ModalComponent>(null);

export const ModalProvider = ({ children }) => {
  const [state, setState] = useState({ component: null, config: {}, visibility: false });

  const providerValue: ModalComponent = {
    state,
    show: (component: any, config: ModalConfig) => {
      setState({ component, config, visibility: true });
    },
    hide: () => {
      setState({ component: null, config: {}, visibility: false });
    },
  };

  return (
    <ModalContext.Provider value={providerValue}>
      {children}
      <Component
        onClose={() => {
          setState({ component: null, config: {}, visibility: false });
        }}
      />
    </ModalContext.Provider>
  );
};

const Component = ({ onClose }: { onClose: () => void }) => {
  const ctx: ModalComponent = useContext(ModalContext);

  const defaultConfig = {
    animation: ModalAnimationEnum.EASE,
    backdropColor: null,
    exitOnBackdrop: null,
  };

  const [ChildrenComponent, setChildrenComponent] = useState<any>(null);
  const [config, setConfig] = useState<ModalConfig>(defaultConfig);
  const [visibility, setVisibility] = useState(true);

  useEffect(() => {
    if (ctx && ctx.state) {
      setChildrenComponent(ctx.state.component);
      setConfig(ctx.state.config);
      setVisibility(ctx.state.visibility);
    }
  }, [ctx]);

  return (
    !!visibility && (
      <Container>
        <ModalContainer visible={!!visibility} config={config} onClose={onClose}>
          {ChildrenComponent}
        </ModalContainer>
      </Container>
    )
  );
};

// Hook
export const useModal = () => useContext(ModalContext);
