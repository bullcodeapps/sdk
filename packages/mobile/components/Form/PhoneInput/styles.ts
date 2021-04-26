import styled from 'styled-components/native';
import DefaultInput, { InputComponent, InputProps } from '../Input';

interface PhoneInputContainerProps {
  color: string;
}

export const PhoneInputContainer = styled.View<PhoneInputContainerProps>`
  flex-grow: 1;
  height: 55px;
  align-items: center;
  border: 1px solid;
  flex-direction: row;
  margin-top: 10px;
  overflow: hidden;
`;

export const Content = styled.View`
  flex-grow: 1;
  flex-direction: row;
`;

export const Input = styled(DefaultInput as InputComponent<InputProps>)`
  flex-grow: 1;
  margin-top: 0;
`;
