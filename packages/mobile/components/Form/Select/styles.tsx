import styled from 'styled-components/native';
import ChevronUpSvg from '../../../../core/assets/icons/chevron-up.svg';
import ChevronDownSvg from '../../../../core/assets/icons/chevron-down.svg';

export const Container = styled.View`
  flex-grow: 1;
  margin-top: 10px;
`;

export const IconContainer = styled.View`
  width: 25px;
  height: 25px;
  align-items: center;
  justify-content: center;
`;

export const ChevronUpIcon = styled(ChevronUpSvg)`
  width: 10px;
  height: 10px;
`;

export const ChevronDownIcon = styled(ChevronDownSvg)`
  width: 10px;
  height: 10px;
`;

export const LoadingBackground = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.2);
`;

export const Loading = styled.ActivityIndicator.attrs({
  size: 'small',
})`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;
