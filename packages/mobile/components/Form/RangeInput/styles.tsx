import styled from 'styled-components/native';
import { Animated } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { windowWidth } from '../../../global-styles';

export const Container = styled.View`
  flex-grow: 1;
  height: 40px;
  margin-top: 10px;
  padding: 0 20px;
`;

export const CustomSlider = styled(MultiSlider).attrs({
  enableLabel: true,
  enabledOne: true,
  enabledTwo: true,
  sliderLength: windowWidth - 45 - 40,
  trackStyle: { backgroundColor: '#B2C1C8', height: 1 },
  selectedStyle: { backgroundColor: '#00f2d5' },
  containerStyle: { flexGrow: 1 },
})``;

export const PointLabelBox = styled(Animated.View)`
  position: absolute;
  align-items: center;
  justify-content: center;
  top: 5px;
`;

export const PointLabel = styled(Animated.Text)`
  position: absolute;
`;

export const TouchablePointArea = styled.TouchableOpacity`
  padding: 15px;
`;

export const PointCircle = styled(Animated.View)`
  background-color: #3a9def;
  width: 20px;
  height: 20px;
  border-radius: 20px;
`;
