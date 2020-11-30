import styled from 'styled-components/native';
import { Animated } from 'react-native';

export const Container = styled(Animated.View)`
  flex-grow: 1;
  margin-top: 10px;
  height: 60px;
  border-width: 1px;
  border-radius: 30px;
`;

export const ButtonBox = styled(Animated.View)`
  flex-grow: 1;
  align-items: center;
  justify-content: center;
`;
