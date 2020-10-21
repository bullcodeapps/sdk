import styled from 'styled-components/native';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface ContainerProps extends TouchableOpacityProps {
  active?: boolean;
  fillWhenActive?: boolean;
  disabled?: boolean;
}

export const Container = styled(TouchableOpacity).attrs((props) => ({
  activeOpacity: props.activeOpacity || Number(props.disabled ? 1 : 0.2),
}))<ContainerProps>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  align-self: flex-start;
  border-width: 1px;
  border-color: #9e9e9e;
  border-radius: 20px;

  ${(props) => props.active && !props.fillWhenActive && 'border-color: #00f2d5;'};

  ${(props) =>
    props.disabled === true &&
    `background-color: #bbc8cf;
     border-color: #bbc8cf;`}

  ${(props) =>
    props.active &&
    props.fillWhenActive &&
    `background-color: #3a9def;
     border-color: #3a9def;`}
`;

export const ChipButtonBox = styled.View`
  padding: 5px 10px;
`;

export const ChipButtonText = styled.Text<ContainerProps>`
  flex-shrink: 1;
  font-size: 14px;
  font-weight: 400;
  align-self: center;

  ${(props) => props.active && props.fillWhenActive && `color: #ffffff`};
`;
