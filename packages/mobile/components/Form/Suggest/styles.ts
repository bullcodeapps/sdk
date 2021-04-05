import { Platform } from 'react-native';
import styled from 'styled-components/native';
import BaseAutocomplete from 'react-native-autocomplete-input';
import { TouchableOpacity } from 'react-native';
import DefaultInput from '@bullcode/mobile/components/Form/Input';

export const Autocomplete = styled(BaseAutocomplete)``;

export const Row = styled(TouchableOpacity).attrs({
  hitSlop: { top: 5, left: 20, bottom: 5, right: 20 },
  disallowInterruption: Platform.OS !== 'ios',
})`
  flex-grow: 1;
  flex-shrink: 0;
  padding: 10px 15px;
`;

export const Text = styled.Text`
  font-size: 16px;
`;

export const Input = styled(DefaultInput).attrs({
  containerStyle: {
    marginTop: 0,
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 'auto',
  },
})`
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: auto;
`;
