import styled from 'styled-components/native';
import { Circle } from '../../../../global-styles';
import CheckMarkSvg from '../../../../../core/assets/icons/check-mark.svg';
import ExclamationMarkSvg from '../../../../../core/assets/icons/exclamation-mark.svg';

export const CheckCircle = styled(Circle)`
  align-items: center;
  justify-content: center;
`;

export const CheckMarkIcon = styled(CheckMarkSvg)`
  width: 12px;
  height: 12px;
  color: #fff;
`;

export const ExclamationMarkIcon = styled(ExclamationMarkSvg)`
  width: 12px;
  height: 12px;
  color: #fff;
`;
