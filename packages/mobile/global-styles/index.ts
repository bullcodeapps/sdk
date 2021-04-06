import { Dimensions } from 'react-native';
import styled from 'styled-components/native';

export const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
export const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

export type CircleProps = { color?: string; size: number };

export const Circle = styled.View<CircleProps>`
  ${(props) => (props.color ? `background-color: ${props.color};` : `background-color: #3a9def;`)}
  ${(props) =>
    props.size
      ? `height: ${props.size}px; width: ${props.size}px; border-radius: ${props.size}px;`
      : 'height: 10px; width: 10px; border-radius: 10px;'}
`;

const ContainerSpaces = {
  paddingRight: 20,
  paddingLeft: 20,
};

export const ContainerDefaults = {
  ...ContainerSpaces,
  getPlainObject: () => ContainerSpaces,
  toString: () => `
    padding-right: 20px;
    padding-left: 20px;
  `,
};

export const DefaultContainer = styled.View`
  ${ContainerDefaults.toString()}
`;
