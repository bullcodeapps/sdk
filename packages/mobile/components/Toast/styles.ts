import styled from 'styled-components/native';
import { Animated } from 'react-native';
import { initialWindowSafeAreaInsets } from 'react-native-safe-area-context';

export const Container = styled(Animated.View)`
  justify-content: center;
  position: absolute;
  top: ${initialWindowSafeAreaInsets.top + 10}px;
  left: 0;
  width: 100%;
  min-height: 0;
  padding-right: 20px;
  padding-left: 20px;
  box-shadow: 1px 5px 5px rgba(0, 0, 0, 0.2);
  z-index: 100;
  elevation: 100;
`;

export const MessageContainer = styled.View`
  flex-shrink: 1;
  padding: 20px;
  background-color: #fff;
  border-radius: 15px;
`;

export const InfoMessage = styled(MessageContainer)`
  background-color: #2abb9b;
`;

export const ErrorMessage = styled(MessageContainer)`
  background-color: #d64541;
`;

export const WarningMessage = styled(MessageContainer)`
  background-color: #f39c12;
`;

export const MessageText = styled.Text`
  color: #fff;
`;
