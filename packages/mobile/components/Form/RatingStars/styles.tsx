import styled from 'styled-components/native';
import StarSvg from '../../../../core/assets/icons/star.svg';
import StarRegularSvg from '../../../../core/assets/icons/star-regular.svg';
import { Animated } from 'react-native';

export const DEFAULT_STAR_SIZE = 35;

export type RatingStarsStateStyles = {
  backgroundStarColor: string,
  foregroundStarColor: string,
};

export type RatingStarsStyle = {
  name: string;
  default: RatingStarsStateStyles;
};

export type RatingStarsStyles = Array<RatingStarsStyle>;

export const DefaultColors: RatingStarsStyles = [
  {
    name: 'primary',
    default: {
      backgroundStarColor: '#bbc8cf',
      foregroundStarColor: '#ffc962',
    },
  },
];

export const Container = styled.View`
  flex-grow: 1;
`;

export const StarTouchableContainer = styled.TouchableOpacity``;

export const StarsContainer = styled(Animated.View)`
  flex-direction: row;
  align-items: center;
`;

export const BackgroundStars = styled(StarsContainer)`
  position: relative;
  overflow: hidden;
  z-index: 1;
  elevation: 1;
`;

export const ForegroundStars = styled(StarsContainer)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  elevation: 2;
`;

export const BackgroundStarIcon = styled(StarRegularSvg) <{ size?: number, color?: string }>`
  ${(props) =>
    !isNaN(props?.size)
      ? `width: ${props?.size}px; height: ${props?.size}px;`
      : `width: ${DEFAULT_STAR_SIZE}px; height: ${DEFAULT_STAR_SIZE}px;`}

  ${props => props.color && `
    color: ${props.color};
  `}
`;

export const ForegroundStarIcon = styled(StarSvg) <{ size?: number, color?: string }>`
  ${(props) =>
    !isNaN(props?.size)
      ? `width: ${props?.size}px; height: ${props?.size}px;`
      : `width: ${DEFAULT_STAR_SIZE}px; height: ${DEFAULT_STAR_SIZE}px;`}

  ${props => props.color && `
    color: ${props.color};
  `}
`;

export const MaskContainer = styled(StarsContainer)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 3;
  elevation: 3;
  overflow: hidden;
`;
