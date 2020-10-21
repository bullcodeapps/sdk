import { TextInput } from 'react-native';
import styled from 'styled-components/native';
import Input, { InputComponent, InputProps } from '../Input';

interface PhoneInputContainerProps {
  color: string;
}

interface PhoneInputProps {
  color: string;
}

export const PhoneInputContainer = styled.View<PhoneInputContainerProps>`
  flex: 1;
  height: 55px;
  align-items: center;

  border: 1px solid;
  border-color: ${(props) => (props.color === 'primary' ? '#bbc8cf' : '#fff')};

  border-radius: 50px;

  flex-direction: row;

  margin-top: 10px;

  overflow: hidden;
`;

export const PhoneInput = styled(Input as InputComponent<TextInput>).attrs((props: PhoneInputProps & InputProps) => ({
  placeholderTextColor: props.color === 'primary' ? '#b3c1c8' : '#fff',
  containerStyle: {
    flex: 1,
    marginTop: 0,
  },
}))<PhoneInputProps & InputProps>`
  padding-left: 10px;
  border: none;

  color: ${(props) => (props.color === 'primary' ? '#2d2d30' : '#fff')};
`;
