import styled from 'styled-components/native';
import { Animated } from 'react-native';

const BG_PRIMARY = '#3a9def';
const BG_SECONDARY = '#ffffff';
const BG_TERTIARY = '#2d2d30';

export type SectionStateStyles = {
  color?: string,
  borderColor?: string,
  backgroundColor?: string;
  borderRadius?: number,
};

export type SectiontStyle = {
  name: string;
  default: SectionStateStyles;
};

export const DefaultColors: SectiontStyle[] = [
  {
    name: 'primary',
    default: {
      backgroundColor: 'transparent',
      borderColor: BG_PRIMARY,
      color: BG_PRIMARY,      
    },
  },
  {
    name: 'secondary',
    default: {
        backgroundColor: 'transparent',
        borderColor: BG_SECONDARY,
        color: BG_SECONDARY,
      
    },
  },
  {
    name: 'tertiary',
    default: {
        backgroundColor: 'transparent',
        borderColor: BG_TERTIARY,
        color: BG_TERTIARY,
      
    },
  },
];

export type SectiontStyles = Array<SectiontStyle>;

export const Container = styled.View`
  flex-grow: 1;
  margin-bottom: 10px;
  marginTop: 20px;
`;

export const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: 500;
`;

export const Content = styled(Animated.View)`
  flex-grow: 1;
`;
