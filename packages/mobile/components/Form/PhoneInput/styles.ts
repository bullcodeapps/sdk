import { TextInput } from 'react-native';
import styled from 'styled-components/native';
import DefaultInput, { InputComponent, InputProps } from '../Input';
import { ValidityMarkComponentType } from '@bullcode/mobile/components/Form/Input/styles';


export type PhoneInputInputComponentStyle = {
  selectionColor: string,
  placeholder: string,
  color: string,
  borderColor?: string,
  backgroundColor?: string;
};

export type PhoneInputSelectComponentStyle = {
  placeholder: string,
  color: string,
  backgroundColor?: string;
  dropDownIcon?: string;
}

export type PhoneInputComponents = {
  select: PhoneInputSelectComponentStyle;
  input: PhoneInputInputComponentStyle;
}

export type ValidityMarkColor = {
  backgroundColor: string;
  color: string;
};

export type ValidityMarkTypes = {
  valid: ValidityMarkColor;
  invalid: ValidityMarkColor;
};

export type PhoneInputStyle = {
  name: string;
  default: PhoneInputComponents & { borderRadius?: number };
  valid?: Partial<PhoneInputComponents>;
  invalid?: Partial<PhoneInputComponents>;
  validityMarkComponent: ValidityMarkComponentType;
  validityMark: ValidityMarkTypes;
};

export type PhoneInputStyles = Array<PhoneInputStyle>;

export const DefaultColors: PhoneInputStyles = [
  {
    name: 'primary',
    default: {
      input: {
        selectionColor: '#3a9def',
        placeholder: '#ffffff',
        color: '#2d2d30',
        borderColor: '#b3c1c8',
      },
      select: {
        placeholder: '#ffffff',
        color: '#ffffff',
        backgroundColor: '#3a9def',
      },
      borderRadius: 25,
    },
    valid: {
      input: {
        selectionColor: '#3a9def',
        placeholder: '#ffffff',
        color: '#2d2d30',
        borderColor: '#3a9def',
      },
      select: {
        placeholder: '#ffffff',
        color: '#ffffff',
        backgroundColor: '#3a9def',
      },
    },
    invalid: {
      input: {
        selectionColor: '#3a9def',
        placeholder: '#ffffff',
        color: '#2d2d30',
        borderColor: '#ffc962',
      },
      select: {
        placeholder: '#ffffff',
        color: '#ffffff',
        backgroundColor: '#3a9def',
      },
    },
    validityMarkComponent: null,
    validityMark: {
      valid: {
        backgroundColor: '#3a9def',
        color: '#ffffff',
      },
      invalid: {
        backgroundColor: '#ffc962',
        color: '#ffffff',
      },
    },
  },
];

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

export const Content = styled.View`
  flex-grow: 1;
  flex-direction: row;
`;

export const Input = styled(DefaultInput as InputComponent<InputProps>)`
  flex-grow: 1;
  margin-top: 0;
`;

