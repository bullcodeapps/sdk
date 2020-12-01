import styled from 'styled-components/native';
import { ContainerDefaults, Circle } from '../../global-styles';
import ChevronDownSvg from '../../../core/assets/icons/chevron-down.svg';
import { Animated } from 'react-native';

export const Container = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: #bbc8cf;
`;

export const AccordionHeader = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding-top: 15px;
  padding-bottom: 15px;
  ${ContainerDefaults.toString()}
`;

export const AccordionHeaderContent = styled.View`
  flex: 1;
`;

export const AccordionChevronCircle = styled(Circle)`
  align-items: center;
  justify-content: center;
`;

export const IconWrapper = styled(Animated.View)`
  flex-shrink: 1;
`;

export const ChevronDownIcon = styled(ChevronDownSvg)`
  width: 10px;
  height: 10px;
  color: #7A7A7B;
`;

export const AccordionContent = styled(Animated.View)` 
  width: 100%;
  overflow: hidden;
`;

export const BodyContainer = styled.View`
  position: absolute;
  /* top: 0; do not use this attribute here */
  right: 0;
  bottom: 0;
  left: 0;
`;
