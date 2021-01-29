import styled from 'styled-components/native';
import { Animated, TextInput } from 'react-native';
import Text from '../../Text';

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
height: 20px;
padding-left: 5px;
padding-top: 5px;
padding-bottom: 5px;
padding-right: 5px;
background-color: #fff;
box-shadow: 0px 0px 5px rgba(255, 255, 255, 1);
border-radius: 5px;
z-index: 1;
`;

export const CounterText = styled(Text) <{ maxLength: number; length: number }>`
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
