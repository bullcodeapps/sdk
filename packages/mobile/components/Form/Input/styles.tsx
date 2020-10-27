import styled from 'styled-components/native';
import { Animated, Platform, TextInput } from 'react-native';

export type InputStateStyles = {
  selectionColor: string,
  placeholder: string,
  color: string,
  borderColor: string,
  borderRadius?: number,
};


export type ValidityMarkColor = {
  backgroundColor: string;
  color: string;
};

export type ValidityMarkTypes = {
  valid: ValidityMarkColor;
  invalid: ValidityMarkColor;
};

export type InputStyle = {
  name: string;
  default: InputStateStyles;
  valid?: Partial<InputStateStyles>;
  invalid?: Partial<InputStateStyles>;
  validityMarkComponent: React.FC<{ isValid?: boolean, colorName?: string, onPress: (data: any) => void }>;
  validityMark: ValidityMarkTypes;
};

export type InputStyles = Array<InputStyle>;

export const DefaultColors: InputStyles = [
  {
    name: 'primary',
    default: {
      selectionColor: '#3a9def',
      placeholder: '#b3c1c8',
      color: '#2d2d30',
      borderColor: '#b3c1c8',
      borderRadius: 25,
    },
    valid: {
      borderColor: '#3a9def',
    },
    invalid: {
      borderColor: '#ffc962',
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

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export const Container = styled(Animated.View)`
flex-grow: 1;
margin-top: 10px;
`;

export const LabelBox = styled.View`
height: 20px;
margin-bottom: 5px;
`;

export const InputField = styled(AnimatedTextInput)`
height: 55px;
padding-left: 20px;
padding-top: 10px;
padding-bottom: 10px;
border-width: 1px;
font-size: 16px;
font-weight: 500;
`;

export const IconContainer = styled.View<{ isMultiline?: boolean; usingValidityMark?: boolean }>`
position: absolute;
top: 0;
${(props) => (props.usingValidityMark && !props.isMultiline ? 'right: 55px;' : 'right: 5px;')}
${(props) => (props.isMultiline ? (props.usingValidityMark ? 'top: 55px;' : 'top: 16px;') : 'top: 0;')}
${(props) => (props.isMultiline ? 'bottom: auto;' : 'bottom: 0;')}
align-items: center;
justify-content: center;
min-width: 50px;
max-height: 55px;
`;

export const CounterBox = styled.View`
position: absolute;
bottom: 10px;
right: 10px;
align-items: center;
justify-content: center;
width: 60px;
height: 20px;
background-color: #fff;
box-shadow: 0px -3px 3px rgba(255, 255, 255, 0.2);
border-radius: 20px;
`;

export const CounterText = styled.Text<{ maxLength: number; length: number }>`
font-size: 14px;
line-height: 14px;
height: ${Platform.OS === 'ios' ? '14' : '18'}px;
color: #bbc8cf;
font-weight: 500;
${(props) => {
  if (props.length >= props.maxLength * 0.9) {
    return 'color: #dc3446';
  }
  if (props.length >= props.maxLength * 0.7) {
    return 'color: #ffc962';
  }
  if (props.length < props.maxLength * 0.7) {
    return 'color: #bbc8cf';
  }
}};
`;
