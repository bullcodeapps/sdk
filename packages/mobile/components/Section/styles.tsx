import styled from 'styled-components/native';
import { Animated, ViewStyle, TextStyle } from 'react-native';

export type SectionContainersStyles = {
  container?: ViewStyle;
  titleStyle?: TextStyle;
  contentContainerStyle?: ViewStyle;
};

export type SectionStyle = {
  name: string;
  default: SectionContainersStyles;
  sectionTitleComponent?: React.ReactNode;
};

export type SectionStyles = Array<SectionStyle>;

export const DefaultStyles: SectionStyles = [{
  name: 'default',
  default: {
    container: {
      flexGrow: 1,
      marginBottom: 10,
      marginTop: 20,
    },
    titleStyle: {
      fontSize: 16,
      fontWeight: '500',
    },
    contentContainerStyle: {
      flexGrow: 1,
    },
  }
}];

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
