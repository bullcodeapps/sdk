import styled from 'styled-components/native';
import { Animated, Platform } from 'react-native';

export const Text = styled(Animated.Text)`
  font-size: 18px;
  height: ${Platform.OS === 'ios' ? '18' : '28'}px;
  font-weight: 500;
`;
