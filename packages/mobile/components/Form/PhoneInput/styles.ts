import { TextInput } from 'react-native';
import styled from 'styled-components/native';
import DefaultInput, { InputComponent } from '../Input';

interface PhoneInputContainerProps {
  color: string;
}

export const PhoneInputContainer = styled.View<PhoneInputContainerProps>`
  flex: 1;
  height: 55px;
  align-items: center;
  border: 1px solid;
  flex-direction: row;
  margin-top: 10px;
  overflow: hidden;
`;

export const Input = styled(DefaultInput as InputComponent<TextInput>).attrs({
  containerStyle: {
    flex: 1,
    marginTop: 0,
  },
})`
  padding-left: 10px;
  border: none;
`;
