import styled from 'styled-components/native';
import { Switch } from 'react-native';

export const Container = styled.View`
  flex-grow: 1;
  margin-top: 10px;
`;

export const SwitchLine = styled.View`
  flex-grow: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const SwitchLabel = styled.Text`
  flex: 1;
  padding-right: 20px;
  font-size: 16px;
  line-height: 20px;
  padding-top: 5px; /* Vertical align guarantee  */
`;

export const SwitchButton = styled(Switch).attrs({
  trackColor: { false: '#bbc8cf', true: '#3a9def' },
  thumbColor: '#fff',
  ios_backgroundColor: '#bbc8cf',
})`
  flex-shrink: 1;
`;
