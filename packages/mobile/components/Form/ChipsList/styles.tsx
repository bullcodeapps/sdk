import styled from 'styled-components/native';
import DefaultChipButton from '../ChipButton';
import { FlatList } from 'react-native';
import { ChipButtonData, ChipsListTypes } from './types';

export const Container = styled.View`
  flex-grow: 1;
`;

export const ChipsBox = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin: 0 20px;
`;

export const ChipButton = styled(DefaultChipButton)<{ type: ChipsListTypes }>`
  margin-right: 10px;
  ${(props) => (props?.type === ChipsListTypes.SCATTERED ? 'margin-top: 10px;' : 'margin-top: 0;')}
`;

export const List = styled(FlatList as new () => FlatList<ChipButtonData>).attrs({
  contentContainerStyle: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
})`
  flex-direction: row;
  flex-shrink: 1;
`;
