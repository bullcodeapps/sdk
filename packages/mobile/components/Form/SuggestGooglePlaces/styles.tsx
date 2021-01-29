import styled from 'styled-components/native';
import MapLocationSvg from '../../../../core/assets/icons/map-location.svg';
import MapLocationColoredSvg from '../../../../core/assets/icons/map-location-colored.svg';
import { TouchableOpacity } from 'react-native';
import CloseSearchSvg from '../../../../core/assets/icons/search-close.svg';

export const MapLocationFilterIconContainer = styled(TouchableOpacity)`
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 0;
  right: 5px;
  height: 55px;
  width: 55px;
  z-index: 2;
  elevation: 2;
`;

export const MapLocationIcon = styled(MapLocationSvg)`
  width: 20px;
  height: 20px;
`;

export const MapLocationColoredIcon = styled(MapLocationColoredSvg)`
  width: 20px;
  height: 20px;
`;

export const DescriptionContainer = styled.View`
  flex: 1;
  flex-direction: row;
`;

export const CloseSearchIcon = styled(CloseSearchSvg)`
  width: 16px;
  height: 16px;
`;

export const ListEmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 10px;
`;

// It must need to use the react native Text instead of SDK Text, because of the theme.
export const ListEmptyText = styled.Text`
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  color: #3a3a3a;
`;
