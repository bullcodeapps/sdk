import styled from 'styled-components/native';
import MapLocationSvg from '../../../../core/assets/icons/map-location.svg';
import MapLocationColoredSvg from '../../../../core/assets/icons/map-location-colored.svg';
import { TouchableOpacity } from 'react-native';
import CloseSearchSvg from '../../../../core/assets/icons/search-close.svg';

export const Container = styled.View`
  flex-grow: 1;
  min-height: 55px;
  margin-top: 10px;
`;

export const MapLocationFilterIconContainer = styled(TouchableOpacity)`
  position: absolute;
  right: 5px;
  height: 55px;
  min-width: 50px;
  align-items: center;
  justify-content: center;
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
