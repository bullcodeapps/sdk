import styled from 'styled-components/native';
import { ContainerDefaults } from '../../global-styles';

export const Container = styled.View`
  flex-grow: 1;
  margin-bottom: 10px;
`;

export const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: 500;
  ${ContainerDefaults.toString()}
`;
