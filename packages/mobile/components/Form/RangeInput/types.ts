import { ViewStyle } from 'react-native';

export type RangeInputResponse = {
  min: number;
  max: number;
};

export type RangeInputProps = {
  name?: string;
  theme?: string;
  labelPosition?: 'top' | 'bottom';
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  initialPoint?: number;
  endPoint?: number;
  minValue: number;
  maxValue: number;
  enabledOne?: boolean;
  enabledTwo?: boolean;
  enableLabel?: boolean;
  optionsArray?: number[];
  labelFormatter?: (value: string | number) => string | number;
  onValuesChange?: (values: RangeInputResponse) => void;
};

type RangeInputCustomStyle = {};

type TrackStyleCustomStyle = {
  backgroundColor: string;
  height: number;
};

export type RangeInputStateStyles = RangeInputCustomStyle & ViewStyle;

export type RangeInputTrackStateStyles = TrackStyleCustomStyle & ViewStyle;

export type RangeInputStyle = {
  name: string;
  marker: {
    defaultStyle: RangeInputStateStyles;
    disabledStyle: RangeInputStateStyles;
  };
  trackStyle: RangeInputTrackStateStyles;
  selectedStyle: RangeInputStateStyles;
};

export type RangeInputStyles = Array<RangeInputStyle>;
