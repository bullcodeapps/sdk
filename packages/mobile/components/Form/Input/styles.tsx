import styled from 'styled-components/native';
import { Animated, Platform, TextInput, TextInputProps } from 'react-native';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface InputFieldProps extends TextInputProps {
  borderColor?: string;
  color?: string;
  useValidityMark?: boolean;
  hasIcon?: boolean;
}

export const Container = styled(Animated.View)`
  flex-grow: 1;
  margin-top: 10px;
`;

export const LabelBox = styled.View`
  height: 20px;
  margin-bottom: 5px;
`;

export const InputField = styled(AnimatedTextInput).attrs((props: InputFieldProps) => {
  return {
    selectionColor:
      props?.color === 'primary'
        ? '#3a9def'
        : props?.color === 'group'
        ? '#144DDE'
        : '#00f2d5',
    placeholderTextColor: props?.color === 'primary' || props?.color === 'group' ? '#b3c1c8' : '#ffffff',
    ...(props?.multiline ? { textAlignVertical: 'top' } : {}),
    ...props,
  };
})<InputFieldProps>`
  font-family: 'Gotham Rounded';
  height: 55px;
  padding-left: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 25px;
  border-width: 1px;
  font-size: 16px;
  font-weight: 500;
  border-color: ${(props) => `${props.borderColor}`};
  color: ${(props) => (props.color === 'primary' || props.color === 'group' ? '#2d2d30' : '#ffffff')};

  ${(props) =>
    props.hasIcon &&
    props.hasIcon === true &&
    `
    padding-right: 45px;
  `}
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
      return `color: #dc3446`;
    }
    if (props.length >= props.maxLength * 0.7) {
      return `color: #ffc962`;
    }
    if (props.length < props.maxLength * 0.7) {
      return `color: #bbc8cf`;
    }
  }};
`;
