import styled, { css } from 'styled-components/native';
import { TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  selectedIndex: number;
  opacity: number;
}

interface DisplayProps {
  noBorderRight: boolean;
  isFilled: boolean;
  isFocused: boolean;
}

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const ActivationCodeContainer = styled.View`
  position: relative;
  flex-direction: row;
  margin-top: 16px;
`;

export const ConfirmationInput = styled.TextInput<InputProps>`
  position: absolute;
  text-align: center;
  background-color: transparent;
  width: 40px;
  top: 0;
  bottom: 0;
  border-width: 0;
  font-size: 0;
  color: transparent;

  ${(props) =>
    props.selectedIndex &&
    css`
      left: ${props.selectedIndex * 32}px;
    `};

  ${(props) =>
    props.opacity &&
    css`
      opacity: ${props.opacity};
    `}
`;

export const Display = styled.View<DisplayProps>`
  width: 40px;
  height: 50px;
  align-items: center;
  justify-content: center;
  overflow: visible;
  margin-right: 8px;
  border-radius: 8px;
  background-color: #80cbf5;

  ${(props) =>
    props.noBorderRight &&
    css`
      border-right-width: 0;
    `}

  ${(props) =>
    props.isFocused &&
    css`
      background-color: #33adf0;
    `}

  ${(props) =>
    props.isFilled &&
    css`
      background-color: #33adf0;
    `}
`;

export const Text = styled.Text`
  font-size: 32px;
  color: #fff;
`;
