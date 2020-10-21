import React, { Ref } from 'react';
import styled from 'styled-components/native';
import { FlatList } from 'react-native';
import { StyledComponent } from 'styled-components';

export type StyledFlatlistComponent<itemT = any> = StyledComponent<
  typeof FlatList,
  FlatList<itemT>,
  {},
  'contentContainerStyle'
>;

export const StyledFlatlist: StyledFlatlistComponent = styled(FlatList)``;

export const Loading = styled.ActivityIndicator.attrs({
  size: 'small',
  color: '#999',
})`
  margin: 30px 0;
`;

export const EmptyListContainer = styled.View`
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
`;

export const EmptyListIconContainer = styled.View`
  align-items: center;
`;

export const NoDataText = styled.Text`
  font-size: 16px;
  text-align: center;
  padding-top: 20px;
`;
