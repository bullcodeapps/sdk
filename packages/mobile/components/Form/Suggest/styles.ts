import { Platform } from 'react-native';
import styled from 'styled-components/native';
import BaseAutocomplete from 'react-native-autocomplete-input';
import { TouchableOpacity, BaseButtonProperties } from 'react-native-gesture-handler';

export const Autocomplete = styled(BaseAutocomplete).attrs((props: any) => ({
  containerStyle: {
    height: props.textInputHeight,
    flexGrow: 1,
  },
  inputContainerStyle: {
    borderTopLeftRadius: props.borderRadius,
    borderTopRightRadius: props.borderRadius,
    borderBottomLeftRadius: props.showBottomBorders ? props.borderRadius : 0,
    borderBottomRightRadius: props.showBottomBorders ? props.borderRadius : 0,
    height: props.textInputHeight,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: props.borderColor,
  },
  listStyle: {
    marginLeft: 0,
    marginRight: 0,
    borderBottomLeftRadius: props.borderRadius,
    borderBottomRightRadius: props.borderRadius,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    flexGrow: 1,
    maxHeight: 170,
    borderWidth: 1,
    borderColor: props.borderColor,
  },
}))<{ showBottomBorders: boolean; borderRadius: number; textInputHeight: number; borderColor?: string }>`
  color: #333;
  font-size: 16px;
`;
//
export const Button = styled(TouchableOpacity).attrs({
  hitSlop: { top: 5, left: 20, bottom: 5, right: 20 },
  disallowInterruption: Platform.OS !== 'ios',
})<BaseButtonProperties>`
  margin: 8px 0;
  height: 28px;
`;

export const Text = styled.Text`
  font-size: 16px;
`;

export const InputContainer = styled.View<{ flexRow: boolean }>`
  padding-left: 16px;
  padding-right: 16px;

  ${(props) =>
    props.flexRow &&
    `
    flex-direction: row;
    align-items: center;
  `}
`;

export const Input = styled.TextInput`
  flex-grow: 1;
  font-family: 'Gotham Rounded';
  font-size: 16px;
  font-weight: 400;
  color: #2d2d30;
`;
