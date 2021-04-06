import { Animated } from 'react-native';
import styled from 'styled-components/native';

export const PointLabelBox = styled(Animated.View)`
  position: absolute;
  align-items: center;
  justify-content: center;
  z-index: 1;
  elevation: 1;
`;

export const PointLabel = styled(Animated.Text)`
  position: absolute;
`;
