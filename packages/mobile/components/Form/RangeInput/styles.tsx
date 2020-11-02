import styled from 'styled-components/native';
import { Animated } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { windowWidth } from '../../../global-styles';

export type RangeInputStyle = {
  name: string;
  markerStyle: {
    backgroundColor: string;
  };
  trackStyle: {
    backgroundColor: string;
    height: number;
  };
  selectedStyle: {
    backgroundColor: string;
  };
};

export type RangeInputStyles = Array<RangeInputStyle>;

export const DefaultColors: RangeInputStyles = [
  {
    name: 'primary',
    markerStyle: {
      backgroundColor: '#3a9def',
    },
    trackStyle: {
      backgroundColor: '#B2C1C8',
      height: 1,
    },
    selectedStyle: {
      backgroundColor: '#00f2d5',
    },
  },
];

export const Container = styled.View`
  flex-grow: 1;
  margin-top: 10px;
`;

export const CustomSlider = styled(MultiSlider).attrs({
  enableLabel: true,
  enabledOne: true,
  enabledTwo: true,
  sliderLength: windowWidth - 45 - 40,
})`
  position: relative;
`;

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

export const TouchablePointArea = styled.TouchableOpacity`
  padding: 15px;
`;

export const PointCircle = styled(Animated.View)`
  width: 20px;
  height: 20px;
  border-radius: 20px;
`;
