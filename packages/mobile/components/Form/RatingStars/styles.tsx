import styled from 'styled-components/native';
import StarSvg from '../../../../core/assets/icons/star.svg';
import { Animated } from 'react-native';

export const DEFAULT_STAR_SIZE = 35;

export const Container = styled.View<{ starsSize?: number }>`
  flex-grow: 1;
  margin-top: 10px;
  ${(props) =>
    !isNaN(props?.starsSize)
      ? `height: ${props?.starsSize}px; width: ${(props?.starsSize + 10) * 4 + props?.starsSize}px;`
      : `height: ${DEFAULT_STAR_SIZE}px; width: ${(DEFAULT_STAR_SIZE + 10) * 4 + DEFAULT_STAR_SIZE}px;`}
`;

export const StarTouchableContainer = styled.TouchableOpacity``;

export const StarsContainer = styled(Animated.View)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  flex-direction: row;
  align-items: center;
`;

export const BackgroundStars = styled(StarsContainer)`
  z-index: 1;
  elevation: 1;
`;

export const ForegroundStars = styled(StarsContainer)`
  z-index: 2;
  elevation: 2;
`;

export const StarIcon = styled(StarSvg)<{ last?: boolean; size?: number }>`
  ${(props) =>
    !isNaN(props?.size)
      ? `width: ${props?.size}px; height: ${props?.size}px;`
      : `width: ${DEFAULT_STAR_SIZE}px; height: ${DEFAULT_STAR_SIZE}px;`}
  ${(props) => (props?.last ? 'margin-right: 0;' : 'margin-right: 10px;')}
`;

export const BackgroundStarIcon = styled(StarIcon)`
  color: #bbc8cf;
`;

export const ForegroundStarIcon = styled(StarIcon)`
  color: #ffc962;
`;

export const MaskContainer = styled(StarsContainer)<{ starsSize: number; rating: number }>`
  z-index: 3;
  elevation: 3;
  overflow: hidden;
  ${(props) => (props?.starsSize ? `height: ${props.starsSize}px;` : `height: ${DEFAULT_STAR_SIZE}px;`)}
  ${(props) =>
    !isNaN(props?.rating)
      ? `width: ${(props.starsSize || DEFAULT_STAR_SIZE) * props.rating + 10 * Math.floor(props.rating)}px;`
      : 'width: 0;'}
`;
