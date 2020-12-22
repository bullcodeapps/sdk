import styled from 'styled-components/native';
import { Animated } from 'react-native';

export type SectionStateStyles = {
  selectionColor: string,
  placeholder: string,
  color: string,
  borderColor?: string,
  backgroundColor?: string;
  borderRadius?: number,
  dropdownIconColor?: string;
};

export type SectiontStyle = {
  name: string;
  default: SectionStateStyles;
  valid?: Partial<SectionStateStyles>;
  invalid?: Partial<SectionStateStyles>;
  disabled?: Partial<SectionStateStyles>;
};

export type SectiontStyles = Array<SectiontStyle>;

export const Container = styled.View`
  flex-grow: 1;
  margin-bottom: 10px;
  margin-top: 20px;
`;

export const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: 500;
`;

export const Content = styled(Animated.View)`
  flex-grow: 1;
`;
