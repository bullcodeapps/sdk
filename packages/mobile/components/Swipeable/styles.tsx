import styled from 'styled-components/native';
import { Animated } from 'react-native';
import EditSvg from '../../../core/assets/icons/edit.svg';
import TrashCanSvg from '../../../core/assets/icons/trash-can.svg';

export const Container = styled(Animated.View)``;

export const Row = styled(Animated.View)`
  flex-shrink: 1;
  width: 100%;
`;

export const Content = styled(Animated.View)`
  flex: 1;
  flex-direction: row;
`;

export const RightAction = styled.View`
  flex-grow: 1;
`;

export const EditRightAction = styled(RightAction)`
  background-color: #ffc962;
  justify-content: center;
`;

export const DeleteRightAction = styled(RightAction)`
  background-color: #dc3446;
  justify-content: center;
`;

export const EditIcon = styled(EditSvg)`
  flex: 1;
  width: 20px;
  height: 20px;
  margin-left: ${70 / 2 - 20 / 2}px;
  color: #000000;
`;

export const TrashCanIcon = styled(TrashCanSvg)`
  position: absolute;
  width: 20px;
  height: 20px;
  /* contentWidth / 2 - iconWidth / 2 ==> center of 70px square */
  margin-left: ${70 / 2 - 20 / 2}px;
  color: #ffffff;
`;

// Right Actions
export const ActionsContainer = styled(Animated.View)`
  width: 100%;
  flex-direction: row;
`;

export const ActionWrapper = styled(Animated.View)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
`;
