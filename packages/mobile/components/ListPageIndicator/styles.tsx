import styled from 'styled-components/native';
import { Animated } from 'react-native';
import { List } from '@bullcode/mobile/components'

export const DEFAULT_INDICATOR_DOT_SIZE = 10;
export const DEFAULT_INDICATOR_DOT_MARGIN_RIGHT = 5;

export const Container = styled.View`
  position: absolute;
  bottom: 0;
  width: 100%;
  align-items: center;
  z-index: 2;
  elevation: 2;
`;

export const ListItemIndicatorList = styled(List)`
  overflow: visible;
`;

export const ListItemIndicatorContent = styled.View``;

export const IndicatorSliderBar = styled(Animated.View)`
  position: absolute;
  top: 0;
  bottom: 0;
  border-radius: ${DEFAULT_INDICATOR_DOT_SIZE}px;
  background-color: #fff;
`;

export const IndicatorDot = styled(Animated.View)`
  border-radius: ${DEFAULT_INDICATOR_DOT_SIZE}px;
  border-width: 1px;
  border-color: #fff;
`;
