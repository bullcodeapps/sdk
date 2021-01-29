import { ViewStyle } from 'react-native';

type RangeInputCustomStyle = {}

type TrackStyleCustomStyle = {
  backgroundColor: string;
  height: number;
}

export type RangeInputStateStyles = RangeInputCustomStyle & ViewStyle;

export type RangeInputTrackStateStyles = TrackStyleCustomStyle & ViewStyle;

export type RangeInputStyle = {
  name: string;
  marker: {
    defaultStyle: RangeInputStateStyles,
    disabledStyle: RangeInputStateStyles,
  };
  trackStyle: RangeInputTrackStateStyles;
  selectedStyle: RangeInputStateStyles;
};

export type RangeInputStyles = Array<RangeInputStyle>;
