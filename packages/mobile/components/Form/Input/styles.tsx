import styled, { css } from 'styled-components/native';
import { Animated, TextInput } from 'react-native';
import Text from '../../Text';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export const Container = styled(Animated.View)`
  flex-grow: 1;
  margin-top: 10px;
`;

export const LabelBox = styled.View<{ floating?: boolean; paddingLeft?: number;  }>`
  height: 20px;
  margin-bottom: 10px;

  ${({floating}) => floating ? css`
    position: absolute;
    z-index: 10;
    padding-top: 5px;
  ` : ''}

  ${({paddingLeft}) => !!paddingLeft ? css`
    padding-left: ${paddingLeft}px;
  ` : ''}
`;

export const InputField = styled(AnimatedTextInput)`
  height: 55px;
  padding-left: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-width: 1px;
  font-size: 16px;
`;

export const IconContainer = styled.View<{
  isMultiline?: boolean;
  usingValidityMark?: boolean;
  usingIconComponent?: boolean;
}>`
position: absolute;
right: 5px;
top: 0;

${({isMultiline, usingValidityMark}) => (isMultiline ?
  (usingValidityMark ? css`
    top: 55px;
  ` : css`
    top: 16px;
  `) : css`
    top: 0;
  `)}

${({isMultiline}) => (isMultiline ? css`
  bottom: auto;
` : css`
  bottom: 0;
`)}

align-items: center;
justify-content: center;
min-width: 50px;
max-height: 55px;
`;

export const StartAdornmentContainer = styled.View`
position: absolute;
top: 0;
bottom: 0;
margin-left: 5px;
align-items: center;
justify-content: center;
min-width: 50px;
max-height: 55px;
`;

export const COUNTER_BOX_BOTTOM = 10;

export const CounterBox = styled.View`
  position: absolute;
  bottom: ${COUNTER_BOX_BOTTOM}px;
  right: 10px;
  align-items: center;
  justify-content: center;
  padding-left: 5px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-right: 5px;
  background-color: #fff;
  box-shadow: 0px 0px 5px rgba(255, 255, 255, 1);
  border-radius: 5px;
  z-index: 1;
`;

export const CounterText = styled(Text)<{ maxLength: number; length: number }>`
  color: #bbc8cf;
  font-weight: 500;
  ${(props) => {
    if (props.length >= props.maxLength * 0.9) {
      return css`color: #dc3446`;
    }
    if (props.length >= props.maxLength * 0.7) {
      return css`color: #ffc962`;
    }
    if (props.length < props.maxLength * 0.7) {
      return css`color: #bbc8cf`;
    }
  }};
`;

export const LabelText = styled(Text)`
  font-weight: 300;
  color: #BCED09;
`;

export const Content = styled.View`
  flex-grow: 1;
`;
