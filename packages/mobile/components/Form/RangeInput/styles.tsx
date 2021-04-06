import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { Animated } from 'react-native';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex-grow: 1;
  margin-top: 10px;
`;

export const CustomSlider = styled(MultiSlider)`
  position: relative;
`;

export const TouchablePointArea = styled.TouchableOpacity`
  padding: 15px;
`;

export const PointCircle = styled(Animated.View)`
  width: 20px;
  height: 20px;
  border-radius: 20px;
`;

export const Content = styled.View`
  flex-grow: 1;
`;
