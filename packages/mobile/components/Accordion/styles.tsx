import styled from 'styled-components/native';
import { ContainerDefaults, Circle } from '../../global-styles';
import ChevronDownSvg from '../../../core/assets/icons/chevron-down.svg';
import { Animated } from 'react-native';

export type AccordionStateStyles = {
  expandedIcon?: {
    backgroundColor?: string,
    iconColor?: string,
  },
  borderBottomColor?: string,
  borderBottomWidth?: number,
};

export type AccordionStyle = {
  name: string;
  default: AccordionStateStyles;
};

export type AccordionStyles = Array<AccordionStyle>;

export const DefaultColors: AccordionStyles = [
  {
    name: 'primary',
    default: {
      expandedIcon: {
        backgroundColor: '#d9dadb',
        iconColor: '#7a7a7b'
      },
      borderBottomColor: '#bbc8cf',
      borderBottomWidth: 1
    },
  },
];

export const Container = styled.View`
  flex-grow: 1;
  border-bottom-width: 1px;
  border-bottom-color: #bbc8cf;
`;

export const Header = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding-top: 15px;
  padding-bottom: 15px;
  ${ContainerDefaults.toString()}
`;

export const AccordionHeaderContent = styled.View`
  flex-grow: 1;
`;

export const IndicatorIconContainer = styled(Circle)`
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

export const Content = styled(Animated.View)`
  width: 100%;
  overflow: hidden;
`;

export const BodyContainer = styled(Animated.View)`
  position: absolute;
  /* top: 0; do not use this attribute here */
  right: 0;
  bottom: 0;
  left: 0;
`;
