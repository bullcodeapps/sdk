import styled from 'styled-components/native';
import { Animated } from 'react-native';
import { initialWindowSafeAreaInsets } from 'react-native-safe-area-context';

const { top: insetTop, bottom: insetBottom } = initialWindowSafeAreaInsets;

export const MODAL_CONTAINER_SPACING = 20;

export const Container = styled.View`
  flex: 1;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

export const Content = styled.View`
  flex: 1;
  position: absolute;
  top: ${insetTop}px;
  right: 0;
  bottom: ${insetBottom}px;
  left: 0;
  align-items: center;
  justify-content: center;
  z-index: 2;
  elevation: 2;
`;

export const Backdrop = styled.TouchableOpacity<{ color?: string }>`
  flex: 1;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  elevation: 1;
  ${(props) => (props?.color ? `background-color: ${props?.color};` : 'background-color: rgba(0, 0, 0, 0.5);')}
`;

export const AnimatedModalWindow = styled(Animated.View)`
  flex-shrink: 1;
  position: absolute;
  top: 0;
  bottom: 0;
  right: ${MODAL_CONTAINER_SPACING}px;
  left: ${MODAL_CONTAINER_SPACING}px;
  justify-content: center;
  min-height: 0;
  z-index: 2;
  elevation: 2;
`;

export const WindowContent = styled.View`
  flex-shrink: 1;
  z-index: 3;
  elevation: 3;
`;
