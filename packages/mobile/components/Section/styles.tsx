import styled from 'styled-components/native';
import { Animated } from 'react-native';
import Text from '../Text';

export const Container = styled.View`
  flex-grow: 1;
  margin-bottom: 10px;
  margin-top: 10px;
`;

export const SectionTitle = styled(Text)`
  flex-grow: 1;
`;

export const Content = styled(Animated.View)`
  flex-grow: 1;
`;
