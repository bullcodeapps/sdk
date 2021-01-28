import styled from 'styled-components/native';
import { Animated, Platform } from 'react-native';
import DefaultText from '../../Text';

const AnimatedText = Animated.createAnimatedComponent(DefaultText);

export const Text = styled(AnimatedText)`
  font-size: 18px;
  height: ${Platform.OS === 'ios' ? '18' : '28'}px;
  font-weight: 500;
`;
