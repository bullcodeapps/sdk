import { TextStyle, ViewStyle } from 'react-native';

// It should be used in cases where it's necessary some specific style.
type RatingStarsBackgroundCustomStyles = {}

// It should be used in cases where it's necessary some specific style.
type RatingStarsForegroundCustomStyles = {}

export type RatingStarsBackgroundStyles = RatingStarsBackgroundCustomStyles & TextStyle;
export type RatingStarsForegroundStyles = RatingStarsForegroundCustomStyles & TextStyle;

export type RatingStarsStateStyles = {
  containerStyles?: ViewStyle;
  contentContainerStyles?: ViewStyle;
  starContainerStyles?: ViewStyle;
  backgroundStar: RatingStarsBackgroundStyles,
  foregroundStar: RatingStarsForegroundStyles,
};

export type RatingStarsStyle = {
  name: string;
  default: RatingStarsStateStyles;
};

export type RatingStarsStyles = Array<RatingStarsStyle>;
